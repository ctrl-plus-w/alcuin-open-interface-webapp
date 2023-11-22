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

      path_name: string | null;
      alcuin_password: string | null;
      available_path_names: string[] | null;

      created_at: string;
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

      created_at: string;
    }

    export type ICreateCourse = Omit<ICourse, 'id' | 'created_at'>;
    export type IUpdateCourse = Partial<ICreateCourse>;

    export interface IGrade {
      id: string;

      user_id: string;
      label: string;
      code: string;

      ue: string;
      code_ue: string;

      coef: number;
      mean: number;

      credits: string;

      created_at: string;
    }

    export type ICreateGrade = undefined;
    export type IUpdateGrade = undefined;

    export interface IQueue {
      id: string;

      user_id: string;

      command: string;
      message: string;
      finished: boolean;

      created_at: string;
    }

    export type ICreateQueue = Omit<IQueue, 'id' | 'created_at'>;
    export type IUpdateQueue = Partial<ICreateQueue>;
  }
}

export default global;
