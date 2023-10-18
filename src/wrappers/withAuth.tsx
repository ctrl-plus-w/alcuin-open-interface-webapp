import { useEffect } from 'react';

import { useRouter } from 'next/router';

import SplashLayout from '@/layout/SplashLayout';

import { useAuth } from '@/context/AuthContext';

interface IPageProps {
  user: Database.IProfile;
}

const withAuth = <IProps extends IPageProps>(Component: React.ComponentType<IProps>) => {
  const Wrapper = (props: IProps) => {
    const router = useRouter();

    const { isLoading, session, user } = useAuth();

    useEffect(() => {
      if (isLoading) return;

      if (!session) router.push('/');
    }, [session, isLoading]);

    if (isLoading || !session || !user) return <SplashLayout />;

    return <Component {...props} user={user} />;
  };

  return Wrapper;
};

export default withAuth;
