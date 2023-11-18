import { SupabaseRepository } from '@/repository/SupabaseRepository';

export interface GradesRepositoryInterface {}

export class GradesRepository
  extends SupabaseRepository<Database.IGrade, Database.ICreateGrade, Database.IUpdateGrade>
  implements GradesRepositoryInterface
{
  relation = 'grades';
}
