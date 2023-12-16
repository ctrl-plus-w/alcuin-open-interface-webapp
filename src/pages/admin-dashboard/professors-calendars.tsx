import { useEffect, useMemo, useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import supabase from '@/instances/supabaseAdmin';

import AdminDashboardLayout from '@/layout/AdminDashboardLayout';

import DatePicker from '@/module/DatePicker';
import WeekCalendar from '@/module/WeekCalendar';

import Combobox from '@/element/ComboBox';

import withAuth from '@/wrapper/withAuth';

import useCoursesRepository from '@/hook/useCoursesRepository';

export const getServerSideProps = (async () => {
  try {
    const { data } = await supabase.rpc('get_professors');

    const professors = data.filter((el: string) => !el.match(/.*[0-9].*/)) as string[];

    return { props: { professors } };
  } catch (err) {
    console.error(err);
    return { props: { professors: [] } };
  }
}) satisfies GetServerSideProps<{ professors: string[] }>;

interface IProps {
  user: Database.IProfile;
}

const AdminProfessorsCalendarsPage = ({
  professors,
}: InferGetServerSidePropsType<typeof getServerSideProps> & IProps) => {
  const coursesRepository = useCoursesRepository();
  const [courses, setCourses] = useState<Database.ICourse[]>([]);

  const [currentProfessor, setCurrentProfessor] = useState<string>('');

  const [relativeDate, setRelativeDateAndDirection] = useState<Date>(new Date());

  /**
   * Fetch the courses of the selected group (not disabled)
   */
  const fetchCourses = async () => {
    const professor = professorsValues.find(({ value }) => value === currentProfessor);
    if (!professor) return;

    const _courses = await coursesRepository.getAllByProfessor(professor.label, { disabled: false });

    const filteredCourses = _courses.filter((course, index) => {
      const _index = _courses.findIndex(
        (_course) =>
          _course.start_datetime === course.start_datetime &&
          _course.end_datetime === course.end_datetime &&
          _course.location === course.location,
      );

      return _index === index;
    });

    setCourses(filteredCourses);
  };

  /**
   * Fetch the courses when the professor change
   */
  useEffect(() => {
    if (currentProfessor === '') return;

    fetchCourses().then();
  }, [currentProfessor]);

  const professorsValues = useMemo(
    () => professors.map((label) => ({ value: label.toLowerCase(), label })),
    [professors],
  );

  return (
    <AdminDashboardLayout className="h-full flex flex-col gap-6 items-start justify-start">
      <Head>
        <title>Dashboard - Calendriers de groupe</title>
      </Head>

      <div className="w-full flex flex-col md:flex-row justify-between gap-4">
        <Combobox
          values={professorsValues}
          placeholder="Sélectionner la catégorie"
          {...{ currentValue: currentProfessor, setCurrentValue: setCurrentProfessor }}
        />

        <DatePicker relativeDate={relativeDate} setRelativeDate={setRelativeDateAndDirection} />
      </div>

      <WeekCalendar date={relativeDate} courses={courses} onEditCb={fetchCourses} />
    </AdminDashboardLayout>
  );
};

export default withAuth(AdminProfessorsCalendarsPage);
