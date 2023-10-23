import { useState, useMemo } from 'react';

import { useRouter } from 'next/router';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Joi from 'joi';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { TypographyH1 } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

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

  const onChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const isValid = useMemo(() => {
    const { error } = formSchema.validate({ email, password });

    if (error) return false;
    return true;
  }, [email, password]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      router.replace('/dashboard');
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className="grid place-items-center w-screen h-screen font-mono">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full max-w-sm px-4">
        <TypographyH1 className="mb-3">Connection</TypographyH1>

        <Input type="email" placeholder="jdoe.ing2026@esaip.org" value={email} onChange={onChange(setEmail)} />
        <Input type="password" placeholder="*******" value={password} onChange={onChange(setPassword)} />

        <Button type="submit" className="mt-3" disabled={!isValid}>
          Se connecter
        </Button>
      </form>
    </div>
  );
};

export default AuthenticationPage;
