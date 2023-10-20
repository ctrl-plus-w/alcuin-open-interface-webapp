/**
 * Stringify an array by putting "," and a "and" between each element.
 * @param arr The array to stringify
 * @returns A stringified version of the array
 */
export const arrayToString = (arr: string[]): string => {
  if (arr.length === 1) return arr[0];
  return `${arr.slice(0, arr.length - 1).join(', ')} and ${arr[arr.length - 1]}`;
};

export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

export const generateArray = <T>(length: number, element: T): T[] => {
  return new Array(length).fill(element);
};

export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const add = <T>(el: T) => {
  return (arr: T[]) => {
    return [...arr, el];
  };
};

export const remove = <T>(el: T) => {
  return (arr: T[]) => {
    return arr.filter((_el) => _el !== el);
  };
};

export const removeById = <T extends { id: string }>(el: T) => {
  return (arr: T[]) => {
    return arr.filter((_el) => _el.id !== el.id);
  };
};
