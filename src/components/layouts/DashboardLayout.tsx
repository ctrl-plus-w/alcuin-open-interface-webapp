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

const DashboardLayout = ({ className, children }: IProps) => {
  const supabase = useSupabaseClient();

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="w-screen h-[100svh] flex flex-col">
      <NavigationMenu className="flex-grow-0 p-6 w-full border-b border-b-gray-200">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Accueil</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/dashboard/grades" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Notes</NavigationMenuLink>
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

export default DashboardLayout;
