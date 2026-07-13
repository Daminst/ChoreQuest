# Calendar Notification History and Special Theme Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the five completed parent-controlled visual themes and add a collapsed, per-day calendar notification history with family visibility for parent/admin accounts and private visibility for children.

**Architecture:** Merge the latest `origin/main` into the existing theme branch so the bad-behavior feature and the theme work coexist. Extend `/api/calendar` with a separate `notifications` map grouped in `Europe/Warsaw`, then render that map through a focused disclosure component below each day's existing entries. Build the verified frontend directly into the tracked `static` directory.

**Tech Stack:** Python 3, FastAPI, SQLAlchemy async, `zoneinfo`, `unittest`, React 18, Vite 6, Tailwind CSS 4, Node's built-in test runner.

## Global Constraints

- Summer Vacation is visual only and must not activate Vacation Mode or alter assignments.
- Existing bad-behavior entries remain visible above notification history.
- Parent/admin accounts see notifications for all users; children see only their own.
- Expanding history never marks a notification read and never navigates away.
- Notification dates use `Europe/Warsaw`; stored naive datetimes are interpreted as UTC.
- Both Polish runtime overlay copies must remain byte-for-byte equivalent in their relevant translation mappings.
- Preserve current mainline child-interface, feature-flag, settings, and bad-behavior changes during conflict resolution.
- `/srv/AGENTS.md` was absent during planning; recheck at completion and update it only if it exists and the result would help future tasks.

## File Structure

- Create `backend/services/calendar_notifications.py`: UTC/local boundary conversion, visibility filtering, response serialization, and date grouping.
- Create `backend/tests/test_calendar_notifications.py`: deterministic unit coverage for privacy, ordering, midnight grouping, and daylight-saving boundaries.
- Modify `backend/routers/calendar.py`: fetch weekly notifications and add the separate `notifications` response property.
- Create `frontend/src/utils/calendarNotifications.js`: merge one or two weekly API responses into the displayed seven-day window.
- Create `frontend/src/utils/calendarNotifications.test.js`: merge and empty-day coverage.
- Create `frontend/src/components/CalendarNotificationHistory.jsx`: self-contained accessible disclosure and compact history rows.
- Create `frontend/src/components/CalendarNotificationHistory.test.js`: source-contract tests for progressive disclosure, accessibility, and recipient privacy.
- Modify `frontend/src/pages/Calendar.jsx`: parallel weekly fetches, notification state, and component placement after day entries.
- Modify `frontend/src/utils/polishOverlayTranslations.test.js`: require calendar-history translations while retaining mainline and theme assertions.
- Modify `frontend/public/local-overrides/pl-runtime.js`: browser-served Polish mappings.
- Modify `polish_translation/pl-runtime.js`: source mirror of Polish mappings.
- Regenerate `static/`: production assets served by the application.

---

### Task 1: Integrate Latest Mainline Without Losing Themes or Bad Behavior

**Files:**
- Merge: `origin/main` into `codex/parent-special-themes`
- Resolve if needed: `.gitignore`
- Resolve if needed: `backend/main.py`
- Resolve if needed: `frontend/src/components/Layout.jsx`
- Resolve if needed: `frontend/src/index.css`
- Resolve if needed: `frontend/public/local-overrides/pl-runtime.js`
- Resolve if needed: `polish_translation/pl-runtime.js`
- Resolve if needed: `frontend/src/utils/polishOverlayTranslations.test.js`

**Interfaces:**
- Consumes: latest `origin/main` bad-behavior implementation and existing special-theme commits through `dd4be28`.
- Produces: one clean branch containing both features, with `theme.router`, `bad_behaviors.router`, `SeasonalThemeLayer`, `BadBehaviorPanel`, all eight special-theme IDs, and the current child-interface styles.

- [ ] **Step 1: Confirm the worktree is clean and refresh the remote reference**

```powershell
git status --short --branch
git fetch origin
```

Expected: branch is `codex/parent-special-themes`; only documentation commits are ahead and there are no uncommitted files.

- [ ] **Step 2: Start a non-committing merge**

```powershell
git merge --no-ff --no-commit origin/main
```

Expected: Git either prepares a clean merge or reports conflicts only in overlapping integration files. Do not select an entire side for CSS, translations, router registration, or tests.

- [ ] **Step 3: Resolve conflicts to these exact invariants**

Use `apply_patch` for each conflicted file, remove every conflict marker, and verify all of the following remain present:

```powershell
rg -n "include_router\((theme|bad_behaviors)\.router\)" backend/main.py
rg -n "SeasonalThemeLayer|BadBehaviorPanel" frontend/src
rg -n "birthday|halloween|april_fools|wet_monday|summer_vacation" backend frontend/src frontend/public/local-overrides/pl-runtime.js polish_translation/pl-runtime.js
rg -n "bad_behavior_enabled|entry_type.*bad_behavior" backend frontend/src srv/chorequest/features.json
rg -n "kid-interface|theme-birthday|theme-summer_vacation" frontend/src/index.css
rg -n "^(<<<<<<<|=======|>>>>>>>)" . --glob '!frontend/node_modules/**' --glob '!.git/**'
```

Expected: the first five searches find both mainline and theme symbols; the conflict-marker search prints nothing.

- [ ] **Step 4: Run the combined source test baseline**

```powershell
python -m unittest discover -s backend/tests -v
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
git diff --check
```

Expected: all backend and frontend tests pass, Vite builds successfully, and `git diff --check` is silent. The known Vite chunk-size warning is non-blocking.

- [ ] **Step 5: Commit the merge**

```powershell
git add -A
git commit -m "merge: integrate current mainline with family themes"
```

Expected: one merge commit and a clean working tree.

---

### Task 2: Add Calendar Notification Grouping and Privacy Policy

**Files:**
- Create: `backend/services/calendar_notifications.py`
- Create: `backend/tests/test_calendar_notifications.py`
- Modify: `backend/routers/calendar.py`

**Interfaces:**
- Consumes: `Notification`, `User`, `UserRole`, and the authenticated `current_user` already used by `get_weekly_calendar`.
- Produces: `calendar_week_utc_bounds(week_start) -> tuple[datetime, datetime]`, `calendar_notification_local_date(created_at) -> str`, and `group_calendar_notifications(notifications, current_user) -> dict[str, list[dict]]`; `/api/calendar` gains `notifications` without changing `days`.

- [ ] **Step 1: Write failing backend tests**

Create `backend/tests/test_calendar_notifications.py`:

```python
import unittest
from datetime import date, datetime
from types import SimpleNamespace

from backend.services.calendar_notifications import (
    calendar_notification_local_date,
    calendar_week_utc_bounds,
    group_calendar_notifications,
)


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


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the tests and confirm the missing module failure**

```powershell
python -m unittest backend.tests.test_calendar_notifications -v
```

Expected: FAIL with `ModuleNotFoundError: No module named 'backend.services.calendar_notifications'`.

- [ ] **Step 3: Implement the tested service**

Create `backend/services/calendar_notifications.py`:

```python
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
```

- [ ] **Step 4: Run the focused tests and confirm they pass**

```powershell
python -m unittest backend.tests.test_calendar_notifications -v
```

Expected: 5 tests PASS.

- [ ] **Step 5: Connect the service to the weekly calendar endpoint**

In `backend/routers/calendar.py`, import the service:

```python
from backend.services.calendar_notifications import (
    calendar_week_utc_bounds,
    group_calendar_notifications,
)
```

Add this helper next to `_append_bad_behavior_entries`:

```python
async def _get_calendar_notifications(
    db: AsyncSession,
    week_start: date,
    current_user: User,
) -> dict[str, list[dict]]:
    utc_start, utc_end = calendar_week_utc_bounds(week_start)
    stmt = (
        select(Notification)
        .options(selectinload(Notification.user))
        .where(
            Notification.created_at >= utc_start,
            Notification.created_at < utc_end,
        )
        .order_by(Notification.created_at.desc(), Notification.id.desc())
    )
    if current_user.role == UserRole.kid:
        stmt = stmt.where(Notification.user_id == current_user.id)

    result = await db.execute(stmt)
    return group_calendar_notifications(result.scalars().all(), current_user)
```

In `get_weekly_calendar`, fetch the history after bad-behavior entries are appended and return it separately:

```python
    await _append_bad_behavior_entries(db, grouped, week_start, week_end, current_user)
    notifications = await _get_calendar_notifications(db, week_start, current_user)

    return {
        "week_start": week_start.isoformat(),
        "week_end": week_end.isoformat(),
        "days": grouped,
        "notifications": notifications,
    }
```

- [ ] **Step 6: Run backend regression tests and commit**

```powershell
python -m unittest discover -s backend/tests -v
git diff --check
git add backend/services/calendar_notifications.py backend/tests/test_calendar_notifications.py backend/routers/calendar.py
git commit -m "feat: add family notification history to calendar"
```

Expected: all backend tests PASS and the commit succeeds.

---

### Task 3: Build the Accessible Collapsed History Component

**Files:**
- Create: `frontend/src/components/CalendarNotificationHistory.jsx`
- Create: `frontend/src/components/CalendarNotificationHistory.test.js`

**Interfaces:**
- Consumes: `{ day: string, notifications: CalendarNotification[], isKid: boolean }`, where `created_at` is an ISO UTC string ending in `Z`.
- Produces: `CalendarNotificationHistory`, which returns `null` for an empty list and otherwise owns its independent expanded/collapsed state.

- [ ] **Step 1: Write a failing source-contract test**

Create `frontend/src/components/CalendarNotificationHistory.test.js`:

```javascript
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(
  new URL('./CalendarNotificationHistory.jsx', import.meta.url),
  'utf8',
);

test('calendar notification history is an accessible progressive disclosure', () => {
  assert.match(source, /useState\(false\)/);
  assert.match(source, /aria-expanded=\{expanded\}/);
  assert.match(source, /aria-controls=\{regionId\}/);
  assert.match(source, /role="region"/);
  assert.match(source, /notifications\.length === 0/);
});

test('calendar notification history hides recipient labels from children', () => {
  assert.match(source, /!isKid && notification\.recipient_name/);
  assert.match(source, /notification\.is_read \? 'Read' : 'Unread'/);
});
```

- [ ] **Step 2: Run the test and confirm the missing-file failure**

```powershell
node --test frontend/src/components/CalendarNotificationHistory.test.js
```

Expected: FAIL with `ENOENT` for `CalendarNotificationHistory.jsx`.

- [ ] **Step 3: Implement the component**

Create `frontend/src/components/CalendarNotificationHistory.jsx`:

```jsx
import { useState } from 'react';
import { Bell, ChevronDown, ChevronUp } from 'lucide-react';

function formatTime(value) {
  if (!value) return '';
  const normalized = /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function CalendarNotificationHistory({
  day,
  notifications = [],
  isKid,
}) {
  const [expanded, setExpanded] = useState(false);
  if (notifications.length === 0) return null;

  const buttonId = `calendar-notifications-button-${day}`;
  const regionId = `calendar-notifications-${day}`;

  return (
    <div className="mt-3 border-t border-border/50 pt-2 min-w-0">
      <button
        id={buttonId}
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={regionId}
        className="w-full flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface-raised/40 hover:text-cream transition-colors"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Bell size={13} className="flex-shrink-0" />
          <span>Notifications</span>
          <span aria-hidden="true">({notifications.length})</span>
        </span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded ? (
        <div
          id={regionId}
          role="region"
          aria-labelledby={buttonId}
          className="mt-2 max-h-64 space-y-2 overflow-y-auto overflow-x-hidden pr-1"
        >
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-md border p-2 min-w-0 ${
                notification.is_read
                  ? 'border-border/40 bg-surface-raised/20'
                  : 'border-accent/40 bg-accent/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-cream text-xs font-medium break-words min-w-0">
                  {notification.title}
                </p>
                <time className="text-[10px] text-muted flex-shrink-0">
                  {formatTime(notification.created_at)}
                </time>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted break-words">
                {notification.message}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted">
                <span>{notification.is_read ? 'Read' : 'Unread'}</span>
                {!isKid && notification.recipient_name ? (
                  <span className="break-words">
                    <span>Recipient</span>
                    <span aria-hidden="true">:</span>{' '}
                    {notification.recipient_name}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run the focused test and commit**

```powershell
node --test frontend/src/components/CalendarNotificationHistory.test.js
git diff --check
git add frontend/src/components/CalendarNotificationHistory.jsx frontend/src/components/CalendarNotificationHistory.test.js
git commit -m "feat: add collapsed calendar notification history"
```

Expected: 2 tests PASS and the commit succeeds.

---

### Task 4: Merge Notification Data Into the Seven-Day Calendar Window

**Files:**
- Create: `frontend/src/utils/calendarNotifications.js`
- Create: `frontend/src/utils/calendarNotifications.test.js`
- Modify: `frontend/src/pages/Calendar.jsx`

**Interfaces:**
- Consumes: weekly responses shaped as `{ days: Record<string, unknown[]>, notifications: Record<string, CalendarNotification[]> }`.
- Produces: `mergeCalendarCollections(startDate, responses, collectionName) -> Record<string, unknown[]>`; `Calendar.jsx` passes one day's notification array to `CalendarNotificationHistory`.

- [ ] **Step 1: Write failing merge tests**

Create `frontend/src/utils/calendarNotifications.test.js`:

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';

import { mergeCalendarCollections } from './calendarNotifications.js';

test('merges notifications from two API weeks into the visible seven days', () => {
  const responses = [
    { notifications: { '2026-07-12': [{ id: 1 }] } },
    { notifications: { '2026-07-13': [{ id: 2 }] } },
  ];
  const result = mergeCalendarCollections(
    '2026-07-12',
    responses,
    'notifications',
  );
  assert.deepEqual(result['2026-07-12'], [{ id: 1 }]);
  assert.deepEqual(result['2026-07-13'], [{ id: 2 }]);
  assert.deepEqual(result['2026-07-18'], []);
});

test('keeps every visible date when an older API omits the collection', () => {
  const result = mergeCalendarCollections('2026-07-13', [{}], 'notifications');
  assert.equal(Object.keys(result).length, 7);
  assert.deepEqual(result['2026-07-13'], []);
});
```

- [ ] **Step 2: Run the tests and confirm the missing module failure**

```powershell
node --test frontend/src/utils/calendarNotifications.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `calendarNotifications.js`.

- [ ] **Step 3: Implement the merge utility**

Create `frontend/src/utils/calendarNotifications.js`:

```javascript
import { addCalendarDays } from './calendarDates.js';

export function mergeCalendarCollections(startDate, responses, collectionName) {
  const byDay = {};
  for (let index = 0; index < 7; index += 1) {
    const day = addCalendarDays(startDate, index);
    byDay[day] = responses.flatMap((response) => {
      const entries = response?.[collectionName]?.[day];
      return Array.isArray(entries) ? entries : [];
    });
  }
  return byDay;
}
```

- [ ] **Step 4: Run the merge tests**

```powershell
node --test frontend/src/utils/calendarNotifications.test.js
```

Expected: 2 tests PASS.

- [ ] **Step 5: Update the calendar fetch without a network waterfall**

In `frontend/src/pages/Calendar.jsx`, add imports:

```javascript
import CalendarNotificationHistory from '../components/CalendarNotificationHistory';
import { mergeCalendarCollections } from '../utils/calendarNotifications';
```

Add state beside `assignments`:

```javascript
  const [calendarNotifications, setCalendarNotifications] = useState({});
```

Replace `fetchCalendar` with:

```javascript
  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const monday1 = getMondayForCalendarWeek(startDate);
      const monday2 = addCalendarDays(monday1, 7);
      const lastDay = addCalendarDays(startDate, 6);
      const sunday1 = addCalendarDays(monday1, 6);
      const weekStarts = lastDay > sunday1 ? [monday1, monday2] : [monday1];
      const results = await Promise.allSettled(
        weekStarts.map((weekStart) => api(`/api/calendar?week_start=${weekStart}`)),
      );

      if (results[0].status === 'rejected') throw results[0].reason;
      const responses = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

      setAssignments(mergeCalendarCollections(startDate, responses, 'days'));
      setCalendarNotifications(
        mergeCalendarCollections(startDate, responses, 'notifications'),
      );
    } catch (err) {
      setError(err.message || 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  }, [startDate]);
```

After the existing assignment/bad-behavior list inside each day column, render:

```jsx
                <CalendarNotificationHistory
                  day={dayStr}
                  notifications={calendarNotifications[dayStr] || []}
                  isKid={isKid}
                />
```

The component must be outside `dayAssignments.map(...)` and directly after its containing list so bad-behavior entries stay above it.

- [ ] **Step 6: Run frontend tests and commit**

```powershell
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
git diff --check
git add frontend/src/utils/calendarNotifications.js frontend/src/utils/calendarNotifications.test.js frontend/src/pages/Calendar.jsx
git commit -m "feat: show notification history for calendar days"
```

Expected: all frontend tests PASS, Vite builds, and the commit succeeds.

---

### Task 5: Keep Polish Overlays and Theme Labels Complete

**Files:**
- Modify: `frontend/src/utils/polishOverlayTranslations.test.js`
- Modify: `frontend/public/local-overrides/pl-runtime.js`
- Modify: `polish_translation/pl-runtime.js`

**Interfaces:**
- Consumes: static English labels emitted by `CalendarNotificationHistory` and special-theme metadata.
- Produces: identical Polish mappings for `Notifications`, `Unread`, `Read`, `Recipient`, and `Family member`, while retaining the eight special-theme labels and descriptions.

- [ ] **Step 1: Add failing translation assertions**

In `frontend/src/utils/polishOverlayTranslations.test.js`, add:

```javascript
const requiredCalendarNotificationTranslations = [
  ['Notifications', 'Powiadomienia'],
  ['Unread', 'Nieprzeczytane'],
  ['Read', 'Przeczytane'],
  ['Recipient', 'Odbiorca'],
  ['Family member', 'Członek rodziny'],
];
```

Add a test using the file's existing translation-map construction:

```javascript
test('polish overlay translates calendar notification history', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    const translations = new Map(
      [...source.matchAll(/^\s*'([^']+)': '([^']*)',/gm)].map((match) => [
        match[1],
        match[2],
      ]),
    );

    for (const [english, polish] of requiredCalendarNotificationTranslations) {
      assert.equal(
        translations.get(english),
        polish,
        `${fileUrl.pathname} maps ${english} incorrectly`,
      );
    }
  }
});
```

- [ ] **Step 2: Run the focused test and confirm missing mappings**

```powershell
node --test frontend/src/utils/polishOverlayTranslations.test.js
```

Expected: FAIL for at least `Unread` because it is not mapped yet.

- [ ] **Step 3: Add the exact mappings to both overlay files**

Add beside the existing notification strings in both `frontend/public/local-overrides/pl-runtime.js` and `polish_translation/pl-runtime.js`:

```javascript
    'Unread': 'Nieprzeczytane',
    'Read': 'Przeczytane',
    'Recipient': 'Odbiorca',
    'Family member': 'Członek rodziny',
```

Keep the existing mapping:

```javascript
    'Notifications': 'Powiadomienia',
```

Also confirm the mappings for Birthday, Halloween, April Fools' Day, Wet Monday, and Summer Vacation and their descriptions remain in both copies.

- [ ] **Step 4: Run translation and full frontend tests, then commit**

```powershell
node --test frontend/src/utils/polishOverlayTranslations.test.js
node --test "frontend/src/**/*.test.js"
git diff --check
git add frontend/src/utils/polishOverlayTranslations.test.js frontend/public/local-overrides/pl-runtime.js polish_translation/pl-runtime.js
git commit -m "feat: translate calendar notification history"
```

Expected: all frontend tests PASS and the commit succeeds.

---

### Task 6: Publish Assets and Perform Final Verification

**Files:**
- Regenerate: `static/index.html`
- Regenerate: `static/assets/*`
- Regenerate: `static/local-overrides/pl-runtime.js`
- Regenerate: `static/sw.js`
- Recheck if present: `/srv/AGENTS.md`

**Interfaces:**
- Consumes: all verified source changes from Tasks 1-5.
- Produces: production assets containing the five new theme cards and calendar notification history.

- [ ] **Step 1: Invoke the required verification and browser skills**

Read and follow completely:

```text
C:\Users\damin\.codex\plugins\cache\openai-curated-remote\superpowers\6.1.1\skills\verification-before-completion\SKILL.md
C:\Users\damin\.codex\plugins\cache\openai-bundled\browser\26.707.62119\skills\control-in-app-browser\SKILL.md
C:\Users\damin\.codex\plugins\cache\openai-curated-remote\build-web-apps\0.1.2\skills\frontend-testing-debugging\SKILL.md
```

Expected: the Browser plugin is used first because it is available in this session.

- [ ] **Step 2: Generate tracked production assets**

From `frontend` inside the worktree:

```powershell
npx vite build --outDir ../static --emptyOutDir
```

Expected: build succeeds; `static/index.html` references new hashed assets and `static/local-overrides/pl-runtime.js` contains the new theme and calendar-history translations.

- [ ] **Step 3: Run fresh automated verification**

From the worktree root:

```powershell
python -m unittest discover -s backend/tests -v
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
git diff --check
```

Expected: all tests PASS, both builds succeed, and `git diff --check` is silent. Record the exact test counts from this fresh run.

- [ ] **Step 4: Run rendered parent/admin QA**

The flow under test is: parent/admin settings -> select each new visual theme -> open calendar -> expand a day's notification history -> confirm bad behavior remains above it.

Use the in-app Browser at desktop `1280x800` and mobile `390x844` to verify:

```text
- Page URL and title are correct.
- The app is not blank and has no framework error overlay.
- Settings shows None, Easter, Christmas, Birthday, Halloween, April Fools' Day, Wet Monday, and Summer Vacation.
- Each new theme selection updates the root theme class and visible decorative layer.
- A day with notifications shows a collapsed count and expands independently.
- Parent/admin history rows show recipient names.
- A bad-behavior card remains visible above notification history.
- Mobile and desktop have no horizontal overflow, clipping, or blocked controls.
- Console has no relevant application errors; explain any known framework warnings.
```

Save screenshots outside the repository for settings and expanded history at both viewports.

- [ ] **Step 5: Run child privacy QA**

The flow under test is: child calendar -> expand notification history -> observe only the child's notifications and no recipient labels.

Verify the API response and rendered UI both exclude another child's notification. Do not infer privacy from hidden CSS alone.

- [ ] **Step 6: Recheck repository instructions and commit generated assets**

```powershell
wsl.exe -e sh -lc "if [ -f /srv/AGENTS.md ]; then cat /srv/AGENTS.md; else echo __MISSING__; fi"
git status --short
git add static
git commit -m "build: publish themes and calendar history"
git status --short --branch
```

Expected: `/srv/AGENTS.md` is either followed and updated if helpful or remains absent; only generated `static` files are included in the build commit; the worktree ends clean.

- [ ] **Step 7: Finish the development branch**

Read and follow completely:

```text
C:\Users\damin\.codex\plugins\cache\openai-curated-remote\superpowers\6.1.1\skills\finishing-a-development-branch\SKILL.md
```

Expected: present the verified integration choices without merging, pushing, or deleting the worktree unless the user selects that action.
