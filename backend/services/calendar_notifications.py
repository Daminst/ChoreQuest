from collections import defaultdict
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo


WARSAW = ZoneInfo("Europe/Warsaw")


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _role_value(user) -> str:
    role = getattr(user, "role", "")
    return getattr(role, "value", role)


def _type_value(notification) -> str:
    notification_type = getattr(notification, "type", "")
    return getattr(notification_type, "value", notification_type)


def calendar_week_utc_bounds(week_start: date) -> tuple[datetime, datetime]:
    local_start = datetime.combine(week_start, time.min, tzinfo=WARSAW)
    local_end = local_start + timedelta(days=7)
    return (
        local_start.astimezone(timezone.utc).replace(tzinfo=None),
        local_end.astimezone(timezone.utc).replace(tzinfo=None),
    )


def calendar_notification_local_date(created_at: datetime) -> str:
    return _as_utc(created_at).astimezone(WARSAW).date().isoformat()


def _recipient_name(notification) -> str:
    recipient = getattr(notification, "user", None)
    if recipient is None:
        return "Family member"
    return (
        getattr(recipient, "display_name", None)
        or getattr(recipient, "username", None)
        or "Family member"
    )


def group_calendar_notifications(notifications, current_user) -> dict[str, list[dict]]:
    visible = []
    for notification in notifications:
        if _role_value(current_user) == "kid" and notification.user_id != current_user.id:
            continue
        visible.append(notification)

    visible.sort(key=lambda item: (item.created_at, item.id), reverse=True)
    grouped = defaultdict(list)
    for notification in visible:
        utc_created_at = _as_utc(notification.created_at)
        grouped[calendar_notification_local_date(notification.created_at)].append(
            {
                "id": notification.id,
                "user_id": notification.user_id,
                "recipient_name": _recipient_name(notification),
                "type": _type_value(notification),
                "title": notification.title,
                "message": notification.message,
                "is_read": notification.is_read,
                "reference_type": notification.reference_type,
                "reference_id": notification.reference_id,
                "created_at": utc_created_at.isoformat().replace("+00:00", "Z"),
            }
        )
    return dict(grouped)
