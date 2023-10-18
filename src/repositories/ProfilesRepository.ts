import { Conditions } from '@/repository/Repository';
import { SupabaseRepository } from '@/repository/SupabaseRepository';

export interface ProfilesRepositoryInterface {
  /**
   * Retrieve a user by its email
   * @param email The user's email
   * @param conditions The conditions
   */
  getByEmail<ConditionType extends Database.IProfile>(
    email: string,
    conditions: Conditions<ConditionType>,
  ): Promise<Database.IProfile | undefined>;
}

export class ProfilesRepository
  extends SupabaseRepository<Database.IProfile, Database.ICreateProfile, Database.IUpdateProfile>
  implements ProfilesRepositoryInterface
{
  relation = 'profiles';

  async getByEmail<ConditionType extends Database.IProfile>(
    email: string,
    conditions?: Conditions<ConditionType>,
  ): Promise<Database.IProfile | undefined> {
    return this.selectOne('*', { email, ...conditions } as Conditions<Database.IProfile>);
  }
}
