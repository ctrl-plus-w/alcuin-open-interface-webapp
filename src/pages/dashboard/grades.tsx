import { useEffect, useMemo, useState } from 'react';

import Head from 'next/head';

import SettingsForm, { State } from '@/components/features/grades/SettingsForm';
import { useToast } from '@/components/ui/use-toast';
import useGradesRepository from '@/hooks/useGradesRepository';

import DashboardLayout from '@/layout/DashboardLayout';

import withAuth from '@/wrapper/withAuth';

import { mean } from '@/util/number.util';

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

  const filteredAndGroupedGrades = useMemo(() => {
    const teaching_units: Record<string, Database.IGrade[]> = {};

    for (const grade of grades) {
      if (!grade.mean) continue;

      if (grade.ue in teaching_units) {
        teaching_units[grade.ue].push(grade);
      } else {
        teaching_units[grade.ue] = [grade];
      }
    }

    return teaching_units;
  }, [grades]);

  const fetchGrades = async () => {
    try {
      const _grades = await gradesRepository.getAll({ user_id: user.id });
      setGrades(_grades);
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    if (state !== State.DONE) return;

    fetchGrades().then();
  }, [state, user]);

  return (
    <DashboardLayout className="h-full flex flex-col gap-6 items-start justify-start">
      <Head>
        <title>Dashboard - Notes</title>
      </Head>

      {state !== State.DONE && <SettingsForm {...{ state, user, setUser }} />}

      {state === State.DONE && (
        <table className="table-auto w-full box-border">
          <tbody className="divide-y divide-border border-b border-border">
            {Object.entries(filteredAndGroupedGrades).map(([ue, grades]) => (
              <>
                <tr key={ue}>
                  <td className="border border-border p-5 bg-[#21232E] truncate">{ue}</td>
                  <td className="border border-border p-5 bg-[#21232E]">
                    {mean(grades.map((g) => [g.mean, g.coef])).toFixed(1)}
                  </td>
                </tr>

                {grades.map(({ label, mean, coef }) => (
                  <tr key={ue + label} className="divide-x divide-border">
                    <td className="p-5 w-full">{label}</td>
                    <td className="flex items-center justify-between gap-8 p-5">
                      {mean} <span className="text-muted-foreground whitespace-nowrap">Coef. {coef}</span>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
};

export default withAuth(DashboardGradesPage);
