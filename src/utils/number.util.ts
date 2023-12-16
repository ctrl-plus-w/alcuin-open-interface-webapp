export const twoDigit = (num: number): string => {
  return num < 0 || num >= 10 ? num.toString() : `0${num}`;
};

type Combination = [number, number];

export const mean = (combinations: Array<Combination>): number => {
  const [sum, coefSum] = combinations.reduce(
    ([accVal, accCoef], [value, coefficient]) => [accVal + value * coefficient, accCoef + coefficient],
    [0, 0],
  );

  return sum / coefSum;
};
