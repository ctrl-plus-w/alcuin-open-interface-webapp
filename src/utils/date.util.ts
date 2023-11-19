import { twoDigit } from '@/util/number.util';

export const getFirstDayOfWeek = (date: Date, firstDayOfWeek: number = 1): Date => {
  const dayOfWeek = date.getDay();
  const difference = (dayOfWeek - firstDayOfWeek + 7) % 7;
  const firstDay = new Date(date);
  firstDay.setDate(date.getDate() - difference);
  return firstDay;
};

export const getLastDayOfWeek = (date: Date, lastDayOfWeek: number = 0): Date => {
  const dayOfWeek = date.getDay();
  const difference = (lastDayOfWeek - dayOfWeek + 7) % 7;
  const lastDay = new Date(date);
  lastDay.setDate(date.getDate() + difference);
  return lastDay;
};

export const getLastDayOfWorkingWeek = (date: Date): Date => {
  return getLastDayOfWeek(date, -2);
};

/**
 * Whether the dates have the same day, month and year
 * @param date1 The first date
 * @param date2 The second date
 * @returns A boolean
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Return a time with the format hh:mm
 * @param date The date to get the time from
 * @returns A string
 */
export const getSimpleTime = (date: Date): string => {
  return [date.getHours(), date.getMinutes()].map(twoDigit).join(':');
};

/**
 * Get the next monday if the date is a day in the week end, otherwise return the same date
 * @param inputDate The date input
 * @returns A date
 */
export const getNextMondayIfWeekEnd = (inputDate: Date): Date => {
  const dayOfWeek = inputDate.getDay();

  // Check if the day is Saturday (6) or Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 2;

    const nextMonday = new Date(inputDate);
    nextMonday.setDate(inputDate.getDate() + daysUntilMonday);

    return nextMonday;
  }

  // If inputDate is not a weekend day, return inputDate
  return inputDate;
};
