import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { Button } from '@/ui/button';
import { TypographyH1, TypographyInlineCode } from '@/ui/typography';

import withAuth from '@/wrapper/withAuth';

interface IProps {
  user: Database.IProfile;
}

const DashboardPage = ({ user }: IProps) => {
  const supabase = useSupabaseClient();

  const logOut = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="w-full h-[100svh] flex flex-col justify-center items-center gap-4">
      <TypographyH1>Hello world !</TypographyH1>

      <TypographyInlineCode>{JSON.stringify({ email: user.email })}</TypographyInlineCode>

      <Button onClick={logOut}>Log out !</Button>
    </div>
  );
};

export default withAuth(DashboardPage);
