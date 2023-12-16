import React, { useMemo, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Joi from 'joi';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { TypographyH1 } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

import { onChange } from '@/util/react.util';

type FormSchemaType = {
  email: string;
  password: string;
};

const formSchema = Joi.object<FormSchemaType>({
  email: Joi.string().not().empty().required(),
  password: Joi.string().not().empty().required(),
});

const AuthenticationPage = (): React.ReactElement => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const { toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = useMemo(() => {
    const { error } = formSchema.validate({ email, password });
    return !error;
  }, [email, password]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      await router.replace('/dashboard');
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      <Head>
        <title>Connection</title>
      </Head>

      <div className="grid place-items-center w-screen h-screen">
        <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full max-w-sm px-4">
          <TypographyH1>Se connecter</TypographyH1>
          <Link href="/" className="text-muted-foreground mb-3">
            Retour à la page d’accueil
          </Link>

          <Input type="email" placeholder="jdoe.ing2026@esaip.org" value={email} onChange={onChange(setEmail)} />
          <Input type="password" placeholder="*******" value={password} onChange={onChange(setPassword)} />

          <Button type="submit" className="mt-3" disabled={!isValid}>
            Se connecter
          </Button>
        </form>
      </div>
    </>
  );
};

export default AuthenticationPage;
