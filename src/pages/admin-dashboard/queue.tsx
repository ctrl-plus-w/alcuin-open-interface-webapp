import { useEffect, useMemo, useState } from 'react';

import Head from 'next/head';

import { formatRelative } from 'date-fns';

import AdminDashboardLayout from '@/layout/AdminDashboardLayout';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { useToast } from '@/ui/use-toast';

import QueueOperationEditor from '@/module/QueueOperationEditor';

import FadedSide from '@/element/FadedSide';

import withAuth from '@/wrapper/withAuth';

import useQueueRepository from '@/hook/useQueueRepository';

import { capitalize } from '@/util/string.util';

import { cn } from '@/lib/utils';

// interface IProps {
//   user: Database.IProfile;
// }

const AdminDashboardQueuePage = () => {
  const queueRepository = useQueueRepository();

  const { toastError } = useToast();

  const [queue, setQueue] = useState<Database.IQueue[]>([]);
  const [selectedOperation, _setSelectedOperation] = useState<Database.IQueue | undefined>();

  const sortedQueue = useMemo(
    () => queue.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [queue],
  );

  const fetchQueue = async () => {
    try {
      const _queue = await queueRepository.getAll();
      setQueue(_queue);
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    fetchQueue().then();
  }, []);

  return (
    <AdminDashboardLayout className="flex flex-col-reverse md:flex-row gap-6">
      <Head>
        <title>Dashboard - Queue</title>
      </Head>

      <FadedSide
        containerClassName="w-full md:w-1/2 h-full"
        className="h-full overflow-y-scroll no-scrollbar flex flex-col gap-2"
      >
        {sortedQueue.map((command) => (
          <Card key={command.id} className="flex-1 basis-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full ring',
                    command.finished
                      ? command.message
                        ? 'bg-red-600 ring-red-200'
                        : 'bg-green-600 ring-green-200'
                      : 'bg-orange-600 ring-orange-200',
                  )}
                ></div>
                {command.command}
              </CardTitle>
              <CardDescription>{capitalize(formatRelative(new Date(command.created_at), new Date()))}</CardDescription>
            </CardHeader>

            <CardContent>
              {command.message ? <p>{command.message}</p> : <p className="opacity-50">Aucun message.</p>}
            </CardContent>
          </Card>
        ))}
      </FadedSide>

      <QueueOperationEditor
        className="w-full md:w-1/2 h-full"
        queue={queue}
        setQueue={setQueue}
        operation={selectedOperation}
      />
    </AdminDashboardLayout>
  );
};

export default withAuth(AdminDashboardQueuePage);
