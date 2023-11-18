import { useEffect, useMemo, useState } from 'react';

import Head from 'next/head';

import SettingsForm, { State } from '@/components/features/grades/SettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';
import { useToast } from '@/components/ui/use-toast';
import useGradesRepository from '@/hooks/useGradesRepository';

import DashboardLayout from '@/layout/DashboardLayout';

import withAuth from '@/wrapper/withAuth';

interface IProps {
  user: Database.IProfile;
}

const DashboardGradesPage = ({ user: _user }: IProps) => {
  const { toastError } = useToast();

  const gradesRepository = useGradesRepository();

  const [user, setUser] = useState<Database.IProfile>(_user);

  const state = useMemo(() => {
    if (!user.alcuin_password || user.alcuin_password === '' || user.alcuin_password === 'INVALID')
      return State.WAITING_PASSWORD;
    if (!user.available_path_names || !user.available_path_names.length) return State.VALIDATING_PATH_NAMES;
    if (!user.path_name || user.path_name === '') return State.WAITING_PATH_NAME;

    return State.DONE;
  }, [user]);

  const [grades, setGrades] = useState<Database.IGrade[]>([]);

  const fetchGrades = async () => {
    try {
      const _grades = await gradesRepository.getAll({ user_id: user.id });
      setGrades(_grades);
    } catch (err) {
      toastError(err);
    }
  };

  const filteredGrades = useMemo(() => grades.filter((g) => g.mean), [grades]);

  useEffect(() => {
    if (state !== State.DONE) return;

    fetchGrades();
  }, [state, user]);

  return (
    <DashboardLayout className="h-full flex flex-col gap-6 items-start justify-start">
      <Head>
        <title>Dashboard - Notes</title>
      </Head>

      {state !== State.DONE && <SettingsForm {...{ state, user, setUser }} />}

      {state === State.DONE && (
        <div className="flex flex-col gap-2">
          {filteredGrades.map(({ label, ue, mean, coef }) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>{ue}</CardDescription>
              </CardHeader>
              <CardContent>
                <TypographyP>
                  Moyenne : {mean}/20 (coef: {coef})
                </TypographyP>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default withAuth(DashboardGradesPage);
