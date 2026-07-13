import asyncio
import unittest
from datetime import date, datetime
from types import SimpleNamespace

from backend.services.calendar_notifications import (
    calendar_notification_local_date,
    calendar_week_utc_bounds,
    group_calendar_notifications,
)
from backend.routers.calendar import _get_calendar_notifications


def make_notification(notification_id, user_id, created_at, *, unread=True):
    return SimpleNamespace(
        id=notification_id,
        user_id=user_id,
        type="announcement",
        title=f"Notice {notification_id}",
        message=f"Message {notification_id}",
        is_read=not unread,
        reference_type=None,
        reference_id=None,
        created_at=created_at,
        user=SimpleNamespace(
            display_name=f"Child {user_id}",
            username=f"child{user_id}",
        ),
    )


class CalendarNotificationHistoryTest(unittest.TestCase):
    def test_summer_week_bounds_convert_warsaw_midnight_to_utc(self):
        start, end = calendar_week_utc_bounds(date(2026, 7, 13))
        self.assertEqual(start, datetime(2026, 7, 12, 22, 0))
        self.assertEqual(end, datetime(2026, 7, 19, 22, 0))

    def test_dst_week_uses_different_start_and_end_offsets(self):
        start, end = calendar_week_utc_bounds(date(2026, 3, 23))
        self.assertEqual(start, datetime(2026, 3, 22, 23, 0))
        self.assertEqual(end, datetime(2026, 3, 29, 22, 0))

    def test_notification_after_utc_2200_belongs_to_next_warsaw_day(self):
        self.assertEqual(
            calendar_notification_local_date(datetime(2026, 7, 13, 22, 30)),
            "2026-07-14",
        )

    def test_parent_gets_family_history_newest_first_with_recipient(self):
        parent = SimpleNamespace(id=1, role="parent")
        grouped = group_calendar_notifications(
            [
                make_notification(1, 2, datetime(2026, 7, 13, 8, 0)),
                make_notification(2, 3, datetime(2026, 7, 13, 9, 0)),
            ],
            parent,
        )
        self.assertEqual([item["id"] for item in grouped["2026-07-13"]], [2, 1])
        self.assertEqual(grouped["2026-07-13"][0]["recipient_name"], "Child 3")
        self.assertTrue(grouped["2026-07-13"][0]["created_at"].endswith("Z"))

    def test_child_gets_only_own_history(self):
        child = SimpleNamespace(id=2, role="kid")
        grouped = group_calendar_notifications(
            [
                make_notification(1, 2, datetime(2026, 7, 13, 8, 0)),
                make_notification(2, 3, datetime(2026, 7, 13, 9, 0)),
            ],
            child,
        )
        self.assertEqual([item["id"] for item in grouped["2026-07-13"]], [1])

    def test_calendar_query_scopes_child_notifications_in_sql(self):
        notifications = [
            make_notification(1, 2, datetime(2026, 7, 13, 8, 0)),
            make_notification(2, 3, datetime(2026, 7, 13, 9, 0)),
        ]

        class FakeResult:
            def scalars(self):
                return self

            def all(self):
                return notifications

        class FakeDb:
            statement = None

            async def execute(self, statement):
                self.statement = statement
                return FakeResult()

        db = FakeDb()
        child = SimpleNamespace(id=2, role="kid")
        grouped = asyncio.run(
            _get_calendar_notifications(db, date(2026, 7, 13), child)
        )

        self.assertIn("notifications.user_id", str(db.statement))
        self.assertEqual([item["id"] for item in grouped["2026-07-13"]], [1])


if __name__ == "__main__":
    unittest.main()
