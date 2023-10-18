import { useState } from 'react';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { AppProps } from 'next/app';

import { SessionContextProvider } from '@supabase/auth-helpers-react';

import '@/style/globals.css';

import { Toaster } from '@/ui/toaster';

import AuthContextProvider from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <AuthContextProvider>
        <Toaster />
        <Component {...pageProps} />
      </AuthContextProvider>
    </SessionContextProvider>
  );
}
