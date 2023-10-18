declare global {
  namespace Database {
    export enum Role {
      USER = 'USER',
      ADMIN = 'ADMIN',
    }

    export interface IProfile {
      id: string;

      email: string;

      role: Role;

      created_at: number;
    }

    export type ICreateProfile = Omit<IProfile, 'id', 'created_at'>;
    export type IUpdateProfile = Partial<ICreateProfile>;
  }
}

export default global;
