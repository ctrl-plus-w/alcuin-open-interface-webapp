import { useMemo, useState } from 'react';

import axios from 'axios';
import generator from 'generate-password-ts';
import Joi from 'joi';
import { CogIcon, EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet';
import { useToast } from '@/ui/use-toast';

import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/context/UsersContext';

import { onChange } from '@/util/react.util';

type FormSchemaType = {
  email: string;
  password: string;
};

const formSchema = Joi.object<FormSchemaType>({
  email: Joi.string().not().empty().required(),
  password: Joi.string().not().empty().required(),
});

interface IProps {
  loggedInUser?: Database.IProfile;
}

const CreateUserSheet = ({ loggedInUser }: IProps) => {
  const { toastError, toast } = useToast();
  const { fetchUsers } = useUsers();
  const { session } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    setPassword(generator.generate({ length: 16, numbers: true }));
  };

  const isValid = useMemo(() => {
    const { error } = formSchema.validate({ email, password });

    if (error) return false;
    return true;
  }, [email, password]);

  const createUser = async () => {
    if (!session) return;

    try {
      await axios.post(
        '/api/users/create',
        { email, password },
        { headers: { Authorization: `Bearer ${session.access_token}` } },
      );

      fetchUsers(loggedInUser);

      toast({
        title: 'Succès !',
        description: `L'utilisateur avec l'email ${email} et le mot de passe ${password} a bien été créé.`,
      });
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          Créer un utilisateur <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Créer un utilisateur</SheetTitle>
          <SheetDescription>
            Veillez à sauvegarder le mot de passe, car celui-ci sera encrypté et ne sera plus disponible après la
            création.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jdoe.ing2026@esaip.org"
              value={email}
              onChange={onChange(setEmail)}
              className="col-span-3"
              autoFocus={false}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Mot de passe</Label>

            <div className="col-span-3 flex items-center space-x-2">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="@peduarte"
                value={password}
                onChange={onChange(setPassword)}
                className="w-full"
                autoFocus={false}
              />

              <Button onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
              </Button>

              <Button onClick={generatePassword}>
                <CogIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button disabled={!isValid} onClick={createUser}>
              Créer l&apos;utilisateur
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateUserSheet;
