"""Avatar catalogue entitlement decisions shared by read and save paths."""

from collections.abc import Iterable, Mapping

from backend.models import AvatarUnlockMethod, UserRole


CATALOG_CONFIG_KEYS = {
    "head": ("head",),
    "hair": ("hair",),
    "eyes": ("eyes",),
    "mouth": ("mouth",),
    "hat": ("hat",),
    "face_extra": ("face_extra",),
    "outfit_pattern": ("outfit_pattern",),
    "pet": ("pet",),
    "accessory": ("accessory", "accessories"),
}


def _enum_value(value):
    return getattr(value, "value", value)


def _config_item_ids(config: Mapping | None, category: str) -> set[str]:
    config = config or {}
    selected: set[str] = set()
    for key in CATALOG_CONFIG_KEYS[category]:
        value = config.get(key)
        values = value if key == "accessories" and isinstance(value, (list, tuple, set)) else (value,)
        for item_id in values:
            if isinstance(item_id, str) and item_id and item_id != "none":
                selected.add(item_id)
    return selected


def is_avatar_item_unlocked(user, item, owned_item_ids: set[int]) -> bool:
    """Return whether a catalogue item is currently usable by this user."""
    role = _enum_value(getattr(user, "role", None))
    if role in (UserRole.parent.value, UserRole.admin.value):
        return True
    if bool(getattr(item, "is_default", False)) or getattr(item, "id", None) in owned_item_ids:
        return True

    method = _enum_value(getattr(item, "unlock_method", None))
    unlock_value = getattr(item, "unlock_value", None)
    if method == AvatarUnlockMethod.free.value:
        return True
    if method == AvatarUnlockMethod.xp.value and unlock_value is not None:
        return getattr(user, "total_points_earned", 0) >= unlock_value
    if method == AvatarUnlockMethod.streak.value and unlock_value is not None:
        return getattr(user, "longest_streak", 0) >= unlock_value
    return False


def find_newly_selected_locked_avatar_items(
    user,
    proposed_config: Mapping | None,
    existing_config: Mapping | None,
    catalog_items: Iterable,
    owned_item_ids: set[int],
) -> list:
    """Find known locked catalogue values newly introduced by a save.

    Existing equipped values and unknown renderer fallback values remain valid for
    backwards compatibility. Pet-level accessories are intentionally absent from
    ``CATALOG_CONFIG_KEYS`` because they use a separate progression system.
    """
    catalog_by_key = {
        (item.category, item.item_id): item
        for item in catalog_items
        if item.category in CATALOG_CONFIG_KEYS
    }
    blocked = []
    for category in CATALOG_CONFIG_KEYS:
        newly_selected = _config_item_ids(proposed_config, category) - _config_item_ids(existing_config, category)
        for item_id in newly_selected:
            item = catalog_by_key.get((category, item_id))
            if item is not None and not is_avatar_item_unlocked(user, item, owned_item_ids):
                blocked.append(item)
    return sorted(blocked, key=lambda item: (item.category, item.item_id))
