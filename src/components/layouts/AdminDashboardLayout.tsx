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
        <NavigationMenuList className="flex-col items-start space-x-0 md:flex-row md:items-center md:space-x-1">
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
            <Link href="/admin-dashboard/queue" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Queue</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Button onClick={signOut} variant="destructive" className="ml-4 mt-4 md:m-0">
              Se déconnecter
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <main className={cn('p-6 overflow-y-scroll', className)}>{children}</main>
    </div>
  );
};

export default AdminDashboardLayout;
