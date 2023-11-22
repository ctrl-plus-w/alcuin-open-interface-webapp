import { SupabaseRepository } from '@/repository/SupabaseRepository';

export interface QueueRepositoryInterface {}

export class QueueRepository
  extends SupabaseRepository<Database.IQueue, Database.ICreateQueue, Database.IUpdateQueue>
  implements QueueRepositoryInterface
{
  relation = 'queue';
}
