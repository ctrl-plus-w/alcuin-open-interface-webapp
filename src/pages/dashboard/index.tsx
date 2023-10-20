import { useEffect, useMemo, useState } from 'react';

import Head from 'next/head';

import { addDays, format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import Card from '@/feature/courses/card';

import DashboardLayout from '@/layout/DashboardLayout';

import { Button } from '@/ui/button';
import { Calendar } from '@/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { TypographyH4 } from '@/ui/typography';

import withAuth from '@/wrapper/withAuth';

import useCoursesRepository from '@/hook/useCoursesRepository';
import useTailwindBreakpoint from '@/hook/useTailwindBreakpoints';

import { getDatesInRange } from '@/util/array.util';
import { getFirstDayOfWeek, getLastDayOfWorkingWeek, isSameDate } from '@/util/date.util';

interface IProps {
  user: Database.IProfile;
}

const DashboardHomePage = ({ user }: IProps) => {
  const coursesRepository = useCoursesRepository();
  const breakpoint = useTailwindBreakpoint();

  const [group, setGroup] = useState<string | undefined>(user.groups[0]);
  const [courses, setCourses] = useState<Database.ICourse[]>([]);

  const [relativeDate, setRelativeDate] = useState(new Date());
  // const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
  // const [endDate, setEndDate] = useState(getLastDayOfWeek(new Date()));

  /**
   * Fetch the courses of the selected group (not disabled)
   */
  const fetchCourses = async () => {
    const _courses = await coursesRepository.getAll({ group, disabled: false });
    setCourses(_courses);
  };

  /**
   * Group courses by their start_time
   * @param courses The courses to group
   * @returns An array of arrays of courses
   */
  const groupCoursesByTime = (courses: Database.ICourse[]) => {
    const sortedAndGroupedCourses: Record<string, Database.ICourse[]> = {};

    for (const course of courses) {
      if (course.start_datetime in sortedAndGroupedCourses) {
        sortedAndGroupedCourses[course.start_datetime].push(course);
      } else {
        sortedAndGroupedCourses[course.start_datetime] = [course];
      }
    }

    return Object.values(sortedAndGroupedCourses).sort((a, b) =>
      new Date(a[0].start_datetime).getTime() > new Date(b[0].end_datetime).getTime() ? 1 : -1,
    );
  };

  const onCalendarNext = () => {
    if (['sm', 'md', 'lg', 'xl'].includes(breakpoint)) {
      setRelativeDate((d) => addDays(d, 1));
    } else {
      setRelativeDate((d) => addDays(d, 7));
    }
  };

  const onCalendarPrevious = () => {
    if (['sm', 'md', 'lg', 'xl'].includes(breakpoint)) {
      setRelativeDate((d) => subDays(d, 1));
    } else {
      setRelativeDate((d) => subDays(d, 7));
    }
  };

  const [startDate, endDate] = useMemo(() => {
    if (['sm', 'md', 'lg'].includes(breakpoint)) {
      return [relativeDate, relativeDate];
    } else if (['xl'].includes(breakpoint)) {
      return [subDays(relativeDate, 1), addDays(relativeDate, 1)];
    } else {
      return [getFirstDayOfWeek(relativeDate), getLastDayOfWorkingWeek(relativeDate)];
    }
  }, [relativeDate, breakpoint]);

  /**
   * Fetch the courses when the group change
   */
  useEffect(() => {
    if (!group) return;

    fetchCourses();
  }, [group]);

  return (
    <DashboardLayout className="h-full flex flex-col gap-6 items-start justify-start">
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="w-full flex flex-col md:flex-row justify-between gap-4">
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

        <div className="flex gap-2 flex-shrink-0 flex-1 md:flex-grow-0">
          <Button onClick={onCalendarPrevious} variant="outline">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 whitespace-nowrap">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(relativeDate, 'EEE dd LLLL', { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={relativeDate}
                onSelect={(_d) => _d && setRelativeDate(_d)}
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={onCalendarNext} variant="outline">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex divide-x divide-zinc-300 w-full h-full">
        {getDatesInRange(startDate, endDate).map((date, i, arr) => (
          <div
            key={i}
            className="flex flex-col gap-2 items-center flex-grow-0 w-full h-full p-4 first:pl-0 last:pr-0"
            style={{ width: `${(1 / arr.length) * 100}%` }}
          >
            <TypographyH4 className="mb-2">{format(date, 'EEE dd LLLL', { locale: fr })}</TypographyH4>

            {groupCoursesByTime(courses.filter((course) => isSameDate(new Date(course.start_datetime), date))).map(
              (courseGroup) => (
                <div key={courseGroup[0].start_datetime} className="flex w-full gap-2">
                  {courseGroup.map((course) => (
                    <Card key={course.id} course={course} onEditCb={fetchCourses} />
                  ))}
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default withAuth(DashboardHomePage);
