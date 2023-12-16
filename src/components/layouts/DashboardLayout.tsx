import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CalendarIcon, GraduationCapIcon, LogOutIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
  children?: React.ReactNode;
}

const DashboardLayout = ({ className, children }: IProps) => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="w-screen h-[100svh] flex flex-col">
      <nav className="z-50 fixed left-1/2 bottom-12 transform -translate-x-1/2 flex items-center gap-2">
        <div className="flex gap-3 p-2.5 rounded-full bg-primary shadow-xl">
          {[
            {
              icon: CalendarIcon,
              href: '/dashboard',
            },
            {
              icon: GraduationCapIcon,
              href: '/dashboard/grades',
            },
          ].map(({ icon: Icon, href }) => (
            <Link
              href={href}
              className={cn('rounded-full p-2', router.asPath == href ? 'bg-primary-foreground text-secondary' : '')}
              key={href}
            >
              <Icon size={24} strokeWidth={1.6} />
            </Link>
          ))}
        </div>

        <button
          onClick={signOut}
          className="ml-3 mr-2 bg-destructive text-destructive-foreground p-4 rounded-full shadow-xl"
        >
          <LogOutIcon size={24} strokeWidth={1.6} />
        </button>
      </nav>

      <main className={className}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
