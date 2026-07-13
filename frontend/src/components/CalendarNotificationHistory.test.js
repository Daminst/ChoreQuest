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

test('calendar notification history uses the Warsaw time formatter', () => {
  assert.match(source, /formatCalendarNotificationTime\(notification\.created_at\)/);
});
