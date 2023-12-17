import { useEffect } from 'react';

import Head from 'next/head';

import AdminDashboardLayout from '@/components/layouts/AdminDashboardLayout';
import CreateUserSheet from '@/components/modules/CreateUserSheet';

import { columns } from '@/feature/users/columns';

import { DataTable } from '@/ui/data-table';

import UsersContextProvider, { useUsers } from '@/context/UsersContext';

import withAuth from '@/wrapper/withAuth';

interface IProps {
  user: Database.IProfile;
}

const AdminDashboardUsersPage = ({ user }: IProps) => {
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers(user).then();
  }, []);

  return (
    <AdminDashboardLayout className="flex flex-col items-start gap-2">
      <Head>
        <title>Dashboard - Utilisateurs</title>
      </Head>

      <CreateUserSheet loggedInUser={user} />
      <DataTable columns={columns(user)} data={users} className="w-full" />
    </AdminDashboardLayout>
  );
};

export default withAuth((props: IProps) => {
  return (
    <UsersContextProvider>
      <AdminDashboardUsersPage {...props} />
    </UsersContextProvider>
  );
});
