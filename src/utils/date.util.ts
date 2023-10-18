import { twoDigit } from './number.util';

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

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getSimpleTime = (date: Date): string => {
  return [date.getHours(), date.getMinutes()].map(twoDigit).join(':');
};
