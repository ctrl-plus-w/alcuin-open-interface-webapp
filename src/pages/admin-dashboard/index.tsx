import Head from 'next/head';

import AdminDashboardLayout from '@/layout/AdminDashboardLayout';

import { TypographyH1, TypographyInlineCode } from '@/ui/typography';

import withAuth from '@/wrapper/withAuth';

interface IProps {
  user: Database.IProfile;
}

const AdminDashboardHomePage = ({ user }: IProps) => {
  return (
    <AdminDashboardLayout className="flex flex-col justify-center items-center gap-4">
      <Head>
        <title>Dashboard</title>
      </Head>

      <TypographyH1>Hello world !</TypographyH1>

      <TypographyInlineCode>{JSON.stringify({ email: user.email })}</TypographyInlineCode>
    </AdminDashboardLayout>
  );
};

export default withAuth(AdminDashboardHomePage);
