import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  formatCalendarNotificationTime,
  mergeCalendarCollections,
  unwrapCalendarResponses,
} from './calendarNotifications.js';


test('formats notification times explicitly in the Warsaw timezone', () => {
  assert.equal(
    formatCalendarNotificationTime('2026-07-13T22:30:00Z', 'en-GB'),
    '00:30',
  );
  assert.equal(
    formatCalendarNotificationTime('2026-01-13T22:30:00Z', 'en-GB'),
    '23:30',
  );
});


test('rejects the whole visible range when either weekly request fails', () => {
  const error = new Error('second week unavailable');
  assert.throws(
    () => unwrapCalendarResponses([
      { status: 'fulfilled', value: { days: {} } },
      { status: 'rejected', reason: error },
    ]),
    (thrown) => thrown === error,
  );
});


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


test('calendar fetches weeks concurrently and renders history after day entries', () => {
  const source = fs.readFileSync(
    new URL('../pages/Calendar.jsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /Promise\.allSettled/);
  assert.match(source, /unwrapCalendarResponses\(results\)/);
  assert.match(source, /setCalendarNotifications/);
  assert.match(source, /<CalendarNotificationHistory/);
  assert.ok(
    source.lastIndexOf('<CalendarNotificationHistory') > source.indexOf('dayAssignments.map'),
  );
});
