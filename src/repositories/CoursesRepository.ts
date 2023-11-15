import { Conditions } from './Repository';

import { SupabaseRepository } from '@/repository/SupabaseRepository';

export interface CoursesRepositoryInterface {
  getAllByProfessor(professor: string): Promise<Database.ICourse[]>;
}

export class CoursesRepository
  extends SupabaseRepository<Database.ICourse, Database.ICreateCourse, Database.IUpdateCourse>
  implements CoursesRepositoryInterface
{
  relation = 'courses';

  async getAllByProfessor(professor: string, conditions?: Conditions<Database.ICourse>): Promise<Database.ICourse[]> {
    let req = this.client.from(this.relation).select('*').contains('professors', [professor]);

    if (conditions) req = this.withConditions(req, conditions);

    const { data, error } = await req;
    if (error) throw error;

    return data;
  }
}
