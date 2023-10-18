import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { SupabaseClient } from '@supabase/supabase-js';

import { Repository, Conditions, getBaseAndNotConditions } from '@/repository/Repository';

import { isStringRecord } from '@/util/object.util';

export abstract class SupabaseRepository<T extends { id: string }, TCreate, TUpdate>
  implements Repository<T, TCreate, TUpdate, string>
{
  protected relation = '';
  protected client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  protected withConditions<ConditionType extends T>(
    baseRequest: PostgrestFilterBuilder<any, any, any, unknown>,
    conditions: Conditions<ConditionType>,
  ): PostgrestFilterBuilder<any, any, any, unknown> {
    const { base: baseConditions, not: notConditions } = getBaseAndNotConditions(conditions);

    for (const conditionKey in baseConditions) {
      const conditionValueOrValues = baseConditions[conditionKey];

      if (Array.isArray(conditionValueOrValues)) {
        baseRequest = baseRequest.in(
          conditionKey,
          conditionValueOrValues.map((el) => el.toString()),
        );
      } else if (isStringRecord(conditionValueOrValues)) {
        if (
          ('lte' in conditionValueOrValues && typeof conditionValueOrValues.lte === 'string') ||
          ('gte' in conditionValueOrValues && typeof conditionValueOrValues.gte === 'string')
        ) {
          if ('lte' in conditionValueOrValues) baseRequest = baseRequest.lte(conditionKey, conditionValueOrValues.lte);
          if ('gte' in conditionValueOrValues) baseRequest = baseRequest.gte(conditionKey, conditionValueOrValues.gte);
        } else {
          baseRequest = baseRequest.contains(conditionKey, conditionValueOrValues);
        }
      } else {
        baseRequest = baseRequest.eq(conditionKey, conditionValueOrValues);
      }
    }

    for (const conditionKey in notConditions) {
      const conditionValueOrValues = notConditions[conditionKey];

      if (Array.isArray(conditionValueOrValues)) {
        baseRequest = baseRequest.not(
          conditionKey,
          'in',
          conditionValueOrValues.map((el) => el.toString()),
        );
      } else {
        baseRequest = baseRequest.neq(conditionKey, conditionValueOrValues);
      }
    }

    return baseRequest;
  }

  protected async select<ConditionType extends T, ReturnType extends T | T[]>(
    select: string,
    conditions?: Conditions<ConditionType>,
    single?: boolean,
    page?: number,
    resultsPerPage?: number,
  ): Promise<ReturnType> {
    let baseRequest = this.client.from(this.relation).select(select);

    // Add the range condition
    if (page !== undefined && resultsPerPage !== undefined) {
      baseRequest = baseRequest.range(page * resultsPerPage, (page + 1) * resultsPerPage - 1);
    }

    // Add the columns conditions
    if (conditions) baseRequest = this.withConditions(baseRequest, conditions);

    const { data, error } = await baseRequest;

    if (error) throw error;

    return (single ? data[0] : data) as unknown as ReturnType;
  }

  protected async selectAll<ConditionType extends T, ReturnType extends T>(
    select: string,
    conditions?: Conditions<ConditionType>,
    page?: number,
    resultsPerPage?: number,
  ): Promise<ReturnType[]> {
    return this.select<ConditionType, ReturnType[]>(select, conditions, false, page, resultsPerPage);
  }

  protected async selectOne<ConditionType extends T, ReturnType extends T>(
    select: string,
    conditions?: Conditions<ConditionType>,
  ): Promise<ReturnType | undefined> {
    return this.select<ConditionType, ReturnType>(select, conditions, true);
  }

  async count<ConditionType extends T>(conditions?: Conditions<ConditionType>): Promise<number> {
    let baseRequest = this.client.from(this.relation).select('*', { count: 'exact', head: true });

    if (conditions) baseRequest = this.withConditions(baseRequest, conditions);

    const { count } = await baseRequest;
    return count ?? 0;
  }

  async getAll(conditions?: Conditions<T>, page?: number, resultsPerPage?: number): Promise<T[]> {
    return this.selectAll('*', conditions, page, resultsPerPage);
  }

  async getById<ConditionType extends T>(id: string, conditions?: Conditions<ConditionType>): Promise<T | undefined> {
    return this.selectOne('*', { id: id, ...conditions } as Conditions<T>);
  }

  async create(entity: TCreate): Promise<T | undefined> {
    const { data, error } = await this.client.from(this.relation).insert([entity]).select('*');

    if (error) throw error;

    return data[0] as T;
  }

  async createMany(entities: TCreate[]): Promise<T[]> {
    const { data, error } = await this.client.from(this.relation).insert(entities).select('*');

    if (error) throw error;

    return data as T[];
  }

  async updateByKey(key: keyof T, value: string, entity: TUpdate): Promise<T | undefined> {
    const { data, error } = await this.client
      .from(this.relation)
      .update([entity])
      .eq(key as string, value)
      .select('*');

    if (error) throw error;

    return data[0] as T;
  }

  async update(id: string, entity: TUpdate): Promise<T | undefined> {
    return this.updateByKey('id', id, entity);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from(this.relation).delete().eq('id', id);

    if (error) throw error;

    return true;
  }
}
