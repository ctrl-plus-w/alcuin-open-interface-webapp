export const twoDigit = (num: number): string => {
  return num < 0 || num >= 10 ? num.toString() : `0${num}`;
};
