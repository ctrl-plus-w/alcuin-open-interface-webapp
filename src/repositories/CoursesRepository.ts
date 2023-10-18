import { SupabaseRepository } from '@/repository/SupabaseRepository';

export interface CoursesRepositoryInterface {}

export class CoursesRepository
  extends SupabaseRepository<Database.ICourse, Database.ICreateCourse, Database.IUpdateCourse>
  implements CoursesRepositoryInterface
{
  relation = 'courses';
}
