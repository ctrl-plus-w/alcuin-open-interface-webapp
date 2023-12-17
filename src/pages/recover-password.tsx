import { FormEvent, useMemo, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { TypographyH1 } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

import { useAuth } from '@/context/AuthContext';

import { onChange } from '@/util/react.util';

const RecoverPage = () => {
  const { toastError, toast } = useToast();

  const router = useRouter();
  const supabase = useSupabaseClient();

  const { isLoading: isLoadingUser, user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // eslint-disable-next-line no-useless-escape
  const isSendEmailDisabled = useMemo(() => !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email), [email]);
  const isRecoverDisabled = useMemo(() => !password.length, [password]);

  const sendEmail = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recover-password`,
      });

      if (error) throw error;

      toast({
        title: 'Regardez vos emails !',
        description: `Un email de réinitialisation vous a été envoyé à l'adresse ${email}.`,
      });
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const recover = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({
        title: 'Succès !',
        description: 'Votre mot de passe a été réinitialisé avec succès.',
      });

      await router.push('/dashboard');
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Récupération du mot de passe</title>
      </Head>

      <main className="container flex flex-col gap-6 py-12">
        <TypographyH1>Réinitialiser le mot de passe</TypographyH1>

        {isLoadingUser || !user ? (
          <form className="flex flex-col items-start gap-6" onSubmit={sendEmail}>
            <div className="flex flex-col gap-2 w-full">
              <Label>Email</Label>

              <Input
                value={email}
                onChange={onChange(setEmail)}
                placeholder="jdoe.ing2027@esaip.org"
                className="max-w-md"
                required
              />
            </div>

            <Button disabled={isSendEmailDisabled || isLoading}>Envoyer l&apos;email</Button>
          </form>
        ) : (
          <form className="flex flex-col items-start gap-6" onSubmit={recover}>
            <div className="flex flex-col gap-2 w-full">
              <Label>Nouveau mot de passe</Label>

              <Input
                value={password}
                onChange={onChange(setPassword)}
                type="password"
                placeholder="********"
                className="max-w-md"
                required
              />
            </div>

            <Button disabled={isRecoverDisabled || isLoading}>Réinitialiser</Button>
          </form>
        )}
      </main>
    </>
  );
};

export default RecoverPage;
