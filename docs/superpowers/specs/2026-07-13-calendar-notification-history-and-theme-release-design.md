# Calendar Notification History and Special Theme Release Design

**Date:** 2026-07-13

## Goal

Deliver the five already implemented parent-controlled visual themes in the version users actually run, and add a compact per-day notification history to the calendar without replacing or hiding bad-behavior entries.

The additional visual themes are:

- Birthday
- Halloween
- April Fools' Day
- Wet Monday
- Summer Vacation

Summer Vacation remains a visual theme only. It does not activate Vacation Mode or change school, chore, or assignment behavior.

## Current State and Root Cause

The additional themes are complete on the isolated `codex/parent-special-themes` branch, but that branch has not been integrated into the current mainline or published `static` build. The live parent/admin settings therefore still expose only the themes present in the latest mainline build.

Since the theme work started, `origin/main` gained the bad-behavior feature and calendar entries. Integration must preserve those changes and resolve overlapping calendar, model, translation, CSS, and generated-asset files deliberately.

## Scope

### Included

- Merge the latest `origin/main` into the special-theme branch and resolve overlapping files deliberately.
- Preserve all current bad-behavior functionality.
- Publish a fresh production frontend build to the tracked `static` directory.
- Add notifications grouped by calendar day to the existing calendar response.
- Show family-wide notification history to parents and administrators.
- Show only the signed-in child's notifications to a child.
- Keep notification history visually collapsed until requested.
- Add automated backend, frontend, translation, and regression coverage.
- Validate parent/admin settings and calendar behavior in the rendered application on desktop and mobile.

### Excluded

- Marking notifications read from the calendar.
- Deleting notifications from the calendar.
- Replacing the notification bell or its existing actions.
- Changing bad-behavior penalty rules or placement.
- Turning the Summer Vacation theme into Vacation Mode.
- Adding new notification types.

## Chosen Architecture

The existing weekly calendar endpoint will return two separate collections for the same Monday-to-Sunday range:

- `days`: assignments and bad-behavior entries, unchanged in purpose.
- `notifications`: notification history grouped by local calendar date.

Keeping these collections separate lets the frontend render notifications below all primary day content without pretending that a notification is a quest or bad-behavior record. It also keeps the current one-request-per-calendar-week pattern and avoids a client-side limit that could silently omit older notifications.

The existing sliding seven-day frontend may request two Monday-to-Sunday weeks. It will merge both `days` and `notifications` into the displayed seven-day window using the same date keys.

## Backend Design

### Query and authorization

For each weekly calendar request, the backend will query notifications whose timestamps fall within the requested week.

- A child query is restricted to `Notification.user_id == current_user.id`.
- A parent or administrator receives notifications for all users in this single-household application.
- Recipient user data is loaded with the notification so each response item can include a display name without per-row queries.

### Date handling

Notification timestamps are stored as naive UTC datetimes. Calendar grouping will treat them as UTC, convert them to `Europe/Warsaw`, and group them by the resulting local date. Query bounds will be derived from local week boundaries and converted back to naive UTC so notifications around midnight appear on the correct Polish calendar day.

### Response shape

Each `notifications[YYYY-MM-DD]` item contains only calendar-history fields:

- `id`
- `user_id`
- `recipient_name`
- `type`
- `title`
- `message`
- `is_read`
- `reference_type`
- `reference_id`
- `created_at`

Items are ordered from newest to oldest within each day. Expanding calendar history is read-only and does not change `is_read`.

### Bad-behavior coexistence

Bad-behavior records remain in `days` as `entry_type: "bad_behavior"`. The notification created for a bad-behavior record also remains in the notification history because the history is an accurate record of what was sent to the child. The two representations have different purposes and are visually separated.

## Frontend Design

### Day-card layout

Each calendar day retains this order:

1. Quest assignments.
2. Bad-behavior entries.
3. A collapsed notification-history control at the bottom.

The control is rendered only when that day has notifications and uses a count, for example `Notifications (3)`. Expanding one day does not expand any other day.

### Expanded history

Each compact history row shows:

- local time,
- title,
- message,
- unread/read visual state,
- recipient name for parent/admin accounts.

Child accounts do not need a recipient label because all visible entries belong to the signed-in child. Rows are informational and do not navigate or mark notifications read in this scope.

The expanded list uses a bounded height with internal scrolling when a day contains many notifications. Controls expose `aria-expanded` and `aria-controls`, and the history region has an accessible label.

### Responsive behavior

The existing one-column mobile calendar remains unchanged structurally. Expanded history stays inside its day column, wraps long text, and cannot create horizontal overflow. On desktop, the seven narrow columns use compact typography and truncation only where the full message remains available in the expanded content.

### Localization

Source strings follow the existing English-source/runtime-Polish-overlay pattern. Both runtime translation copies receive matching entries for notification-history labels, read status, and recipient text. Existing theme translations remain present after integration.

## Theme Integration Design

The latest mainline will be merged into the existing theme branch. Conflict resolution will preserve the theme implementation in this dependency order:

1. Family special-theme backend API and persistence.
2. Theme resolution and root classes.
3. Parent/admin settings registration.
4. Decorative layer and CSS palettes.
5. Polish translations.

Conflicts will preserve the current mainline's bad-behavior, child-interface, settings, and translation additions while adding the theme-specific changes. After source verification, Vite will generate the tracked production assets in `static` so the running deployment exposes the new picker cards.

## Error Handling

- A failure to load the calendar or its notification history uses the existing calendar error state.
- Missing recipient data falls back to a neutral recipient label rather than failing the response.
- Empty notification days omit the disclosure control.
- Unknown notification types render with the generic notification style.
- The calendar response remains backward-compatible for clients that ignore the new `notifications` property.

## Testing Strategy

### Backend

- Parent/admin receive family-wide notification history.
- A child receives only their own history.
- Notifications are grouped on the correct Europe/Warsaw day around UTC midnight and daylight-saving boundaries.
- Items are newest-first within a day.
- Existing assignment and bad-behavior calendar entries remain present.
- All supported special-theme identifiers remain accepted and unknown identifiers rejected.

### Frontend

- Notification collections from one or two weekly responses merge into the displayed seven days.
- The disclosure control is absent for empty days.
- The history starts collapsed and toggles independently per day.
- Parent/admin rows include recipient names; child rows do not.
- Bad-behavior entries remain regular visible calendar content.
- Both Polish overlays contain identical new strings and all special-theme translations.
- Existing theme-layer, reduced-motion, and palette tests continue to pass.

### Rendered QA

- Parent/admin settings shows all eight options: none, Easter, Christmas, and the five additions.
- Selecting each new theme changes the root class and visible decoration.
- Calendar notification history expands and collapses on desktop and mobile.
- Bad-behavior entries remain above notification history.
- No relevant console errors, framework overlay, clipping, or horizontal overflow.

## Success Criteria

- The five additional visual themes are visible and selectable in the deployed parent/admin settings build.
- Theme selection persists and synchronizes as before.
- Each calendar day with notifications exposes a collapsed history control.
- Parents/admins see family notifications with recipients; children see only their own.
- Bad-behavior entries remain visible and unchanged.
- Full backend tests, frontend tests, production build, source checks, and rendered QA pass.
