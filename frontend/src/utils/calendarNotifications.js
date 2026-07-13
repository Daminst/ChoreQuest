import { addCalendarDays } from './calendarDates.js';


const WARSAW_TIME_OPTIONS = {
  timeZone: 'Europe/Warsaw',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

const DEFAULT_WARSAW_TIME_FORMATTER = new Intl.DateTimeFormat(
  undefined,
  WARSAW_TIME_OPTIONS,
);


export function formatCalendarNotificationTime(createdAt, locale) {
  const formatter = locale
    ? new Intl.DateTimeFormat(locale, WARSAW_TIME_OPTIONS)
    : DEFAULT_WARSAW_TIME_FORMATTER;
  return formatter.format(new Date(createdAt));
}


export function unwrapCalendarResponses(results) {
  const failedResult = results.find((result) => result.status === 'rejected');
  if (failedResult) throw failedResult.reason;
  return results.map((result) => result.value);
}


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
