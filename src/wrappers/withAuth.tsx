import React, { useEffect } from 'react';

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

      if (!session) router.push('/').then();
    }, [session, isLoading]);

    useEffect(() => {
      if (!user) return;

      if (router.asPath.startsWith('/dashboard') && user.role === 'ADMIN') router.replace('/admin-dashboard').then();
      if (router.asPath.startsWith('/admin-dashboard') && user.role !== 'ADMIN') router.replace('/dashboard').then();
    }, [user]);

    if (isLoading || !session || !user) return <SplashLayout />;

    return <Component {...props} user={user} />;
  };

  return Wrapper;
};

export default withAuth;
