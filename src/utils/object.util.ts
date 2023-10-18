export const keys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const isStringRecord = (obj: unknown): obj is Record<string, string> => {
  if (typeof obj !== 'object' || !obj) return false;

  if (Array.isArray(obj)) return false;

  if (Object.getOwnPropertySymbols(obj).length > 0) return false;

  return keys(obj).every((prop) => ['string', 'number', 'boolean'].includes(typeof obj[prop]));
};
