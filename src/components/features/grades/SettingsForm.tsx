import type { Dispatch, ReactElement, SetStateAction } from 'react';
import { FormEvent, useEffect, useState } from 'react';

import { Label } from '@radix-ui/react-label';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Input } from '@/ui/input';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { TypographyH1, TypographyH3, TypographyP } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

import useProfilesRepository from '@/hook/useProfilesRepository';

import { onChange } from '@/util/react.util';
import { encryptDataWithRSA } from '@/util/string.util';
import { cn } from '@/util/style.util';

export enum State {
  WAITING_PASSWORD = 'WAITING_PASSWORD',
  VALIDATING_PATH_NAMES = 'VALIDATING_PATH_NAMES',
  WAITING_PATH_NAME = 'WAITING_PATH_NAME',
  DONE = 'DONE',
}

interface IProps {
  state: State;

  user: Database.IProfile;
  setUser: Dispatch<SetStateAction<Database.IProfile>>;

  className?: string;
}

const SettingsForm = ({ state, user, setUser, className }: IProps): ReactElement => {
  const { toastError } = useToast();

  const profilesRepository = useProfilesRepository();

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState('');
  const [selectedPathName, setSelectedPathName] = useState('');

  const onSubmitPassword = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const rsaPublicKeyStr = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;
      if (!rsaPublicKeyStr) {
        console.error('Missing environment variable `NEXT_PUBLIC_RSA_PUBLIC_KEY`.');
        console.error(process.env);
        throw new Error('Invalid server config, please contact the administrator.');
      }

      // eslint-disable-next-line no-console
      console.log(rsaPublicKeyStr);

      const rsaPublicKey = rsaPublicKeyStr.split('\n').join('\n');

      const encryptedPassword = encryptDataWithRSA(password, rsaPublicKey);
      const _user = await profilesRepository.update(user.id, { alcuin_password: encryptedPassword });
      if (_user) setUser(_user);
    } catch (err) {
      toastError(err);
    }
  };

  const onSubmitPathName = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const _user = await profilesRepository.update(user.id, { path_name: selectedPathName });
      if (_user) setUser(_user);
    } catch (err) {
      toastError(err);
    }
  };

  const checkUser = async () => {
    try {
      const _user = await profilesRepository.getById(user.id);
      if (_user) setUser(_user);
    } catch (_err) {
      return;
    }
  };

  useEffect(() => {
    if (state !== State.VALIDATING_PATH_NAMES) return;

    const interval = setInterval(checkUser, 30 * 1000);
    return () => clearInterval(interval);
  }, [state, user]);

  if (state === State.DONE) return <></>;

  return (
    <div className={className}>
      <TypographyH1 className="mb-3">Initialisation des paramètres</TypographyH1>

      {state === State.WAITING_PASSWORD && (
        <form className="flex flex-col gap-4">
          <TypographyP className="mb-3">
            Veuillez entrer votre mot de passe Alcuin. Attention, la vérification du mot de passe peut prendre plusieurs
            minutes. De ce fait, soyez sur du mot de passe que vous entrez.
          </TypographyP>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Mot de passe</Label>

            <div className="col-span-3 flex items-start space-x-2">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="******"
                value={password}
                onChange={onChange(setPassword)}
                className={cn('w-full', user.alcuin_password === 'INVALID' && 'border-red-700 ring ring-red-100')}
                autoFocus={false}
              />

              <Button onClick={() => setShowPassword((v) => !v)} type="button">
                {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
              </Button>
            </div>

            {user.alcuin_password === 'INVALID' && <small className="text-red-700 italic">Mot de passe invalide</small>}
          </div>

          <Button disabled={password === ''} onClick={onSubmitPassword} className="ml-auto">
            Envoyer le mot de passe
          </Button>
        </form>
      )}

      {state === State.VALIDATING_PATH_NAMES && (
        <>
          <TypographyP className="mb-3">
            Le serveur vérifie que le mot de passe que vous avez entré est valid et récupère les parcours disponibles.
          </TypographyP>

          <Card>
            <CardContent className="flex flex-col items-center py-24">
              <TypographyH3>Validation du mot de passe</TypographyH3>
              <TypographyP className="mb-8">Cette opération peut prendre plusieurs minutes...</TypographyP>
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        </>
      )}

      {state === State.WAITING_PATH_NAME && (
        <form onSubmit={onSubmitPathName} className="flex flex-col gap-4">
          <TypographyP className="mb-3">
            Veuillez sélectionner le parcours dont vous voulez visionner les notes. Pour être sur de votre choix, vous
            pouvez aller vérifier sur votre Alcuin dans la catégorie parcours (de la même manière que lorsque vous allez
            voir vos notes) la valeur de la colonne &quot;Code&quot;.
          </TypographyP>

          <RadioGroup value={selectedPathName} onValueChange={setSelectedPathName}>
            {user.available_path_names?.map((pathName) => (
              <div key={pathName} className="flex items-center gap-3">
                <RadioGroupItem id={pathName} value={pathName} />
                <Label htmlFor={pathName}>{pathName}</Label>
              </div>
            ))}
          </RadioGroup>

          <Button disabled={selectedPathName === ''} type="submit" className="mr-auto mt-2">
            Valider le parcours
          </Button>
        </form>
      )}
    </div>
  );
};

export default SettingsForm;
