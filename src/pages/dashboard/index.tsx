import { useEffect, useState } from 'react';

import Head from 'next/head';

import DatePicker from '@/components/modules/DatePicker';
import { isBefore } from 'date-fns';

import DashboardLayout from '@/layout/DashboardLayout';

import { Combobox } from '@/ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

import WeekCalendar from '@/module/WeekCalendar';

import withAuth from '@/wrapper/withAuth';

import useCoursesRepository from '@/hook/useCoursesRepository';

import { unique } from '@/util/array.util';

interface IProps {
  user: Database.IProfile;
}

const DashboardHomePage = ({ user }: IProps) => {
  const coursesRepository = useCoursesRepository();

  const [highlightedCourses, setHighlightedCourses] = useState<Database.ICourse[]>([]);

  const [group, setGroup] = useState<string | undefined>(user.groups[0]);
  const [courses, setCourses] = useState<Database.ICourse[]>([]);

  const [relativeDate, setRelativeDate] = useState<Date>(new Date());

  /**
   * Fetch the courses of the selected group (not disabled)
   */
  const fetchCourses = async () => {
    const _courses = await coursesRepository.getAll({ group, disabled: false });
    setCourses(_courses);
  };

  const highlightNextCourse = (item: { label: string; value: string }) => {
    const [candidate] = courses
      .filter(({ title, start_datetime }) => title === item.label && new Date(start_datetime).getTime() >= Date.now())
      .sort((a, b) => (isBefore(new Date(a.start_datetime), new Date(b.start_datetime)) ? -1 : 1));

    if (!candidate) return;
    setRelativeDate(new Date(candidate.start_datetime));
    setHighlightedCourses([candidate]);
  };

  /**
   * Fetch the courses when the group change
   */
  useEffect(() => {
    if (!group) return;

    fetchCourses().then();
  }, [group]);

  return (
    <DashboardLayout className="h-full flex flex-col items-start justify-start">
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="w-full flex flex-col md:flex-row justify-between px-5 py-3.5 gap-4 border-b border-input">
        <Select value={group} onValueChange={(_group) => setGroup(_group)}>
          <SelectTrigger className="w-full md:w-auto">
            <SelectValue placeholder="Selectionner un groupe" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {user.groups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Combobox
          data={unique(
            courses
              .filter(({ start_datetime }) => new Date(start_datetime).getTime() >= Date.now())
              .map(({ title }) => title),
          )}
          item={null}
          setItem={(i) => i && 'value' in i && highlightNextCourse(i)}
          selectPlaceholder="Aller au prochain cours"
        />

        <DatePicker relativeDate={relativeDate} setRelativeDate={setRelativeDate} />
      </div>

      <WeekCalendar
        courses={courses}
        highlightedCourses={highlightedCourses}
        onEditCb={fetchCourses}
        date={relativeDate}
      />
    </DashboardLayout>
  );
};

export default withAuth(DashboardHomePage);
