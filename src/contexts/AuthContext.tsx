import { createContext, useContext, useEffect, useState } from 'react';

import { Session, useSupabaseClient } from '@supabase/auth-helpers-react';

import useProfilesRepository from '@/hook/useProfilesRepository';

import { shallowCompareSessions } from '@/util/supabase.util';

interface IAuthContext {
  user: Database.IProfile | null;
  setUser: React.Dispatch<React.SetStateAction<Database.IProfile | null>>;

  session: Session | null;

  isLoading: boolean;

  error: any;
}

const initialContext: IAuthContext = {
  user: null,
  setUser: () => null,
  session: null,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<IAuthContext>(initialContext);

export const useAuth = () => useContext(AuthContext);

interface IProps {
  children?: React.ReactNode;
}

const AuthContextProvider = ({ children }: IProps) => {
  const profilesRepository = useProfilesRepository();
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<Database.IProfile | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<any>(null);

  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!shallowCompareSessions(sessionData.session, session)) setSession(sessionData.session);
    } catch (err) {
      setError(err);
    } finally {
      setIsSessionLoading(false);
    }
  };

  const fetchUser = async () => {
    if (!session || !session.user.email) return;

    setIsUserLoading(true);

    try {
      const profile = await profilesRepository.getByEmail(session.user.email);
      if (profile) setUser(profile);
    } catch (err) {
      setError(err);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    if (!session) return;

    fetchUser();
  }, [session]);

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, _session) => {
      setSession(_session);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        session,
        isLoading: isSessionLoading || isUserLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
