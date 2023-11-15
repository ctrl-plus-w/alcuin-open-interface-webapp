import Link from 'next/link';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { Button } from '@/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/ui/navigation-menu';

import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
  children?: React.ReactNode;
}

const AdminDashboardLayout = ({ className, children }: IProps) => {
  const supabase = useSupabaseClient();

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="w-screen h-[100svh] flex flex-col">
      <NavigationMenu className="flex-grow-0 p-6 w-full border-b border-b-gray-200">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/admin-dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/admin-dashboard/users" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Utilisateurs</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/admin-dashboard/groups-calendars" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Calendriers de groupe</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/admin-dashboard/professors-calendars" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Calendriers d&apos;enseignants
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Button onClick={signOut} variant="destructive">
              Se déconnecter
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <main className={cn('p-6', className)}>{children}</main>
    </div>
  );
};

export default AdminDashboardLayout;
