import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { useToast } from '@/ui/use-toast';

import Combobox from '@/element/ComboBox';

import useProfilesRepository from '@/hook/useProfilesRepository';
import useQueueRepository from '@/hook/useQueueRepository';

import { cn } from '@/util/style.util';

interface IProps {
  users: Database.IProfile[];

  queue: Database.IQueue[];
  setQueue: Dispatch<SetStateAction<Database.IQueue[]>>;

  operation: Database.IQueue;
  className?: string;
}

const availableCommands = ['SCRAPE_GRADES', 'SCRAPE_CALENDARS'].map((command) => ({
  label: command,
  value: command.toLocaleLowerCase(),
}));

const QueueOperationEditorUpdate = ({ className }: IProps) => {
  return <Card className={cn(className)}>TODO</Card>;
};

const QueueOperationEditorCreate = ({ users, setQueue, className }: Omit<IProps, 'operation'>) => {
  const queueRepository = useQueueRepository();
  const { toastError } = useToast();

  const [selectedCommand, setSelectedCommand] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const availableUsers = users.map((user) => ({ label: user.email, value: user.email.toLocaleLowerCase() }));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const command = availableCommands.find((c) => c.value === selectedCommand);
    const user = users.find((u) => u.email === selectedUser);

    if (!command || !user) return;

    try {
      setIsLoading(true);

      const createdQueueOperation = await queueRepository.create({
        user_id: user.id,
        command: command.label,
        finished: false,
      });

      if (createdQueueOperation) setQueue((queue) => [...queue, createdQueueOperation]);
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Créer une opération</CardTitle>
        <CardDescription>
          Ajoute une opération à la queue actuelle à partir d&apos;une commande et d&apos;un utilisateur.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Combobox
            currentValue={selectedCommand}
            setCurrentValue={setSelectedCommand}
            values={availableCommands}
            placeholder="Sélectionner la commande"
          />

          <Combobox
            currentValue={selectedUser}
            setCurrentValue={setSelectedUser}
            values={availableUsers}
            placeholder="Sélectionner un utilisateur"
          />

          <Button disabled={selectedCommand === '' || selectedUser === ''} type="submit" className="ml-auto mt-8">
            {isLoading ? <Loader2 className="animate-spin" /> : "Créer l'opération"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const QueueOperationEditor = ({
  operation,
  ...props
}: Omit<IProps, 'operation' | 'users'> & Partial<Pick<IProps, 'operation'>>) => {
  const profilesRepository = useProfilesRepository();
  const { toastError } = useToast();

  const [users, setUsers] = useState<Database.IProfile[]>([]);

  const fetchUsers = async () => {
    try {
      const _users = await profilesRepository.getAll();
      setUsers(_users);
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    fetchUsers().then();
  }, []);

  if (!operation) return <QueueOperationEditorCreate {...{ users, ...props }} />;
  return <QueueOperationEditorUpdate {...{ users, operation, ...props }} />;
};

export default QueueOperationEditor;
