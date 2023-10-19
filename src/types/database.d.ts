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

      groups: string[];

      created_at: number;
    }

    export type ICreateProfile = Omit<IProfile, 'id' | 'created_at'>;
    export type IUpdateProfile = Partial<ICreateProfile>;

    export interface ICourse {
      id: string;

      title: string;
      description: string;
      start_datetime: string;
      end_datetime: string;

      group: string;
      professors: string[];
      location: string;

      disabled: boolean;

      created_at: number;
    }

    export type ICreateCourse = Omit<ICourse, 'id' | 'created_at'>;
    export type IUpdateCourse = Partial<ICreateCourse>;
  }
}

export default global;
