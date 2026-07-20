import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException
from backend.models import AvatarUnlockMethod, UserRole
from backend.routers.auth import update_me
from backend.routers.avatar import AvatarConfig, save_avatar
from backend.schemas import UpdateProfileRequest
from backend.services.avatar_entitlements import (
    find_newly_selected_locked_avatar_items,
    is_avatar_item_unlocked,
)


def item(
    item_id,
    *,
    database_id=1,
    category="hat",
    default=False,
    method=AvatarUnlockMethod.shop,
    value=50,
):
    return SimpleNamespace(
        id=database_id,
        item_id=item_id,
        category=category,
        display_name=item_id.replace("_", " ").title(),
        is_default=default,
        unlock_method=method,
        unlock_value=value,
    )


def user(role=UserRole.kid, *, xp=0, streak=0):
    return SimpleNamespace(
        id=1,
        username="tester",
        display_name="Tester",
        role=role,
        points_balance=0,
        total_points_earned=xp,
        current_streak=0,
        longest_streak=streak,
        streak_freezes_used=0,
        streak_freeze_month=None,
        avatar_config={},
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )


class FakeScalarResult:
    def __init__(self, values):
        self.values = values

    def scalars(self):
        return self

    def all(self):
        return self.values


class FakeDb:
    def __init__(self, *result_sets):
        self.result_sets = list(result_sets)
        self.committed = False

    async def execute(self, _query):
        return FakeScalarResult(self.result_sets.pop(0))

    async def commit(self):
        self.committed = True

    async def refresh(self, _user):
        return None


class AvatarEntitlementDecisionTests(unittest.TestCase):
    def test_defaults_owned_and_earned_milestones_are_unlocked_for_kids(self):
        kid = user(xp=250, streak=8)

        self.assertTrue(is_avatar_item_unlocked(kid, item("round", default=True), set()))
        self.assertTrue(is_avatar_item_unlocked(kid, item("crown", database_id=2), {2}))
        self.assertTrue(is_avatar_item_unlocked(
            kid,
            item("shades", method=AvatarUnlockMethod.xp, value=200),
            set(),
        ))
        self.assertTrue(is_avatar_item_unlocked(
            kid,
            item("hearts", method=AvatarUnlockMethod.streak, value=7),
            set(),
        ))

    def test_unearned_shop_drop_xp_and_streak_items_remain_locked_for_kids(self):
        kid = user(xp=199, streak=6)

        for locked_item in [
            item("shop", method=AvatarUnlockMethod.shop),
            item("drop", method=AvatarUnlockMethod.quest_drop),
            item("xp", method=AvatarUnlockMethod.xp, value=200),
            item("streak", method=AvatarUnlockMethod.streak, value=7),
        ]:
            self.assertFalse(is_avatar_item_unlocked(kid, locked_item, set()))

    def test_parents_and_admins_are_unrestricted(self):
        locked_item = item("legendary_drop", method=AvatarUnlockMethod.quest_drop)

        self.assertTrue(is_avatar_item_unlocked(user(UserRole.parent), locked_item, set()))
        self.assertTrue(is_avatar_item_unlocked(user(UserRole.admin), locked_item, set()))

    def test_save_validation_rejects_new_locked_single_and_multi_accessory_choices(self):
        catalog = [
            item("crown", database_id=1, category="hat"),
            item("cape", database_id=2, category="accessory"),
            item("wings", database_id=3, category="accessory"),
            item("dragon", database_id=4, category="pet"),
        ]
        blocked = find_newly_selected_locked_avatar_items(
            user(),
            {
                "hat": "crown",
                "accessory": "cape",
                "accessories": ["cape", "wings"],
                "pet": "dragon",
            },
            {"hat": "none", "accessory": "none", "accessories": [], "pet": "none"},
            catalog,
            set(),
        )

        self.assertEqual(
            {(entry.category, entry.item_id) for entry in blocked},
            {("hat", "crown"), ("accessory", "cape"), ("accessory", "wings"), ("pet", "dragon")},
        )

    def test_save_validation_allows_owned_defaults_milestones_and_role_bypass(self):
        catalog = [
            item("round", database_id=1, category="head", default=True),
            item("cape", database_id=2, category="accessory"),
            item("shades", database_id=3, category="eyes", method=AvatarUnlockMethod.xp, value=200),
            item("hearts", database_id=4, category="eyes", method=AvatarUnlockMethod.streak, value=7),
        ]
        proposed = {"head": "round", "accessory": "cape", "accessories": ["cape"], "eyes": "shades"}

        self.assertEqual(find_newly_selected_locked_avatar_items(user(xp=200), proposed, {}, catalog, {2}), [])
        self.assertEqual(find_newly_selected_locked_avatar_items(user(streak=7), {"eyes": "hearts"}, {}, catalog, set()), [])
        self.assertEqual(find_newly_selected_locked_avatar_items(user(UserRole.parent), proposed, {}, catalog, set()), [])
        self.assertEqual(find_newly_selected_locked_avatar_items(user(UserRole.admin), proposed, {}, catalog, set()), [])

    def test_save_validation_preserves_equipped_locked_and_unknown_legacy_values(self):
        catalog = [item("crown", category="hat"), item("dragon", database_id=2, category="pet")]
        existing = {"hat": "crown", "accessory": "legacy_renderer_value", "pet_accessory": "crown"}
        proposed = {
            "hat": "crown",
            "accessory": "legacy_renderer_value",
            "accessories": ["legacy_renderer_value"],
            "pet_accessory": "crown",
        }

        self.assertEqual(
            find_newly_selected_locked_avatar_items(user(), proposed, existing, catalog, set()),
            [],
        )


class AvatarSaveEntitlementTests(unittest.IsolatedAsyncioTestCase):
    async def test_kid_save_rejects_new_locked_items_before_persisting(self):
        kid = user()
        kid.id = 7
        kid.avatar_config = {"hat": "none", "accessories": []}
        kid.updated_at = None
        db = FakeDb(
            [
                item("crown", database_id=1, category="hat"),
                item("cape", database_id=2, category="accessory"),
            ],
            [],
        )

        with self.assertRaises(HTTPException) as raised:
            await save_avatar(
                AvatarConfig(config={"hat": "crown", "accessories": ["cape"]}),
                db=db,
                user=kid,
            )

        self.assertEqual(raised.exception.status_code, 403)
        self.assertFalse(db.committed)
        self.assertEqual(kid.avatar_config, {"hat": "none", "accessories": []})

    @patch("backend.routers.avatar.ws_manager.broadcast", new_callable=AsyncMock)
    async def test_parent_save_remains_unrestricted(self, broadcast):
        parent = user(UserRole.parent)
        parent.id = 8
        parent.avatar_config = {"hat": "none"}
        parent.updated_at = None
        db = FakeDb()

        response = await save_avatar(
            AvatarConfig(config={"hat": "crown", "pet": "dragon"}),
            db=db,
            user=parent,
        )

        self.assertTrue(db.committed)
        self.assertEqual(response["avatar_config"]["hat"], "crown")
        broadcast.assert_awaited_once()

    async def test_profile_update_cannot_bypass_kid_avatar_entitlements(self):
        kid = user()
        kid.id = 9
        kid.avatar_config = {"hat": "none"}
        kid.updated_at = None
        db = FakeDb([item("crown", database_id=1, category="hat")], [])

        with self.assertRaises(HTTPException) as raised:
            await update_me(
                UpdateProfileRequest(avatar_config={"hat": "crown"}),
                db=db,
                user=kid,
            )

        self.assertEqual(raised.exception.status_code, 403)
        self.assertFalse(db.committed)
        self.assertEqual(kid.avatar_config, {"hat": "none"})


if __name__ == "__main__":
    unittest.main()
