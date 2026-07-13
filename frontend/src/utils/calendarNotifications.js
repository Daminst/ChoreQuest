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
