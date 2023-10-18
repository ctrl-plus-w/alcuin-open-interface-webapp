// ? The conditions base, map the object keys to either its value or an array of the values.
// ? The partial is used for jsob values so conditions do not require to fill all the keys.
type BaseConditions<T> = {
  [K in keyof T]?: T[K] extends Record<string, any> ? Partial<T[K]> : T[K] | T[K][] | { gte?: string; lte?: string };
};

export type Conditions<T> = BaseConditions<T> & { not?: BaseConditions<T> };
interface IGetBaseAndNotConditionsReturnType<T> {
  base: BaseConditions<T>;
  not: BaseConditions<T>;
}

export const getBaseAndNotConditions = <T>(conditions: Conditions<T>): IGetBaseAndNotConditionsReturnType<T> => {
  const { not, ..._base } = conditions;
  return { not: not ?? {}, base: _base } as IGetBaseAndNotConditionsReturnType<T>;
};

export interface Repository<T, TCreate, TUpdate, K> {
  count(conditions?: Conditions<T>): Promise<number>;
  getAll(conditions?: Conditions<T>, page?: number, resultsPerPage?: number): Promise<T[]>;
  getById(id: K): Promise<T | undefined>;

  create(entity: TCreate): Promise<T | undefined>;
  createMany(entity: TCreate[]): Promise<T[]>;

  update(id: string, entity: TUpdate): Promise<T | undefined>;

  delete(id: K): Promise<boolean>;
}
