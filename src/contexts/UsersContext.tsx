import React, { createContext, useContext, useState } from 'react';

import useProfilesRepository from '@/hooks/useProfilesRepository';

interface IUserContext {
  users: Database.IProfile[];
  setUsers: React.Dispatch<React.SetStateAction<Database.IProfile[]>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  error: unknown;
  setError: React.Dispatch<React.SetStateAction<unknown>>;

  fetchUsers: (loggedInUser?: Database.IProfile) => Promise<void>;
}

const initialContext: IUserContext = {
  users: [],
  setUsers: () => null,

  isLoading: false,
  setIsLoading: () => null,

  error: false,
  setError: () => null,

  fetchUsers: async () => undefined,
};

export const UsersContext = createContext<IUserContext>(initialContext);

export const useUsers = () => useContext(UsersContext);

interface IProps {
  children?: React.ReactNode;
}

const UsersContextProvider = ({ children }: IProps) => {
  const profilesRepository = useProfilesRepository();

  const [users, setUsers] = useState<Database.IProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const fetchUsers = async (loggedInUser?: Database.IProfile) => {
    try {
      setIsLoading(true);

      const conditions = loggedInUser ? { not: { id: loggedInUser.id } } : {};
      const users = await profilesRepository.getAll(conditions);

      setUsers(users);
    } catch (err) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ users, setUsers, isLoading, setIsLoading, error, setError, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContextProvider;
