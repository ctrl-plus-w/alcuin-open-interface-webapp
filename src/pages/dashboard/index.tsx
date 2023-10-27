import { useEffect, useState } from 'react';

import Head from 'next/head';

import { addDays, format, isAfter, isBefore, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import DashboardLayout from '@/layout/DashboardLayout';

import { Button } from '@/ui/button';
import { Calendar } from '@/ui/calendar';
import { Combobox } from '@/ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

import WeekCalendar from '@/module/WeekCalendar';

import withAuth from '@/wrapper/withAuth';

import useCoursesRepository from '@/hook/useCoursesRepository';
import useTailwindBreakpoint from '@/hook/useTailwindBreakpoints';

import { unique } from '@/util/array.util';

interface IProps {
  user: Database.IProfile;
}

const DashboardHomePage = ({ user }: IProps) => {
  const coursesRepository = useCoursesRepository();
  const breakpoint = useTailwindBreakpoint();

  const [highlightedCourses, setHighlightedCourses] = useState<Database.ICourse[]>([]);

  const [group, setGroup] = useState<string | undefined>(user.groups[0]);
  const [courses, setCourses] = useState<Database.ICourse[]>([]);

  const [[direction, relativeDate], setRelativeDateAndDirection] = useState<[1 | -1, Date]>([1, new Date()]);

  /**
   * Fetch the courses of the selected group (not disabled)
   */
  const fetchCourses = async () => {
    const _courses = await coursesRepository.getAll({ group, disabled: false });
    setCourses(_courses);
  };

  const onCalendarNext = () => {
    if (['sm', 'md', 'lg', 'xl'].includes(breakpoint)) {
      setRelativeDateAndDirection(([_, d]) => [1, addDays(d, 1)]);
    } else {
      setRelativeDateAndDirection(([_, d]) => [1, addDays(d, 7)]);
    }
  };

  const onCalendarPrevious = () => {
    if (['sm', 'md', 'lg', 'xl'].includes(breakpoint)) {
      setRelativeDateAndDirection(([_, d]) => [-1, subDays(d, 1)]);
    } else {
      setRelativeDateAndDirection(([_, d]) => [-1, subDays(d, 7)]);
    }
  };

  const highlightNextCourse = (item: { label: string; value: string }) => {
    const [candidate] = courses
      .filter(({ title, start_datetime }) => title === item.label && new Date(start_datetime).getTime() >= Date.now())
      .sort((a, b) => (isBefore(new Date(a.start_datetime), new Date(b.start_datetime)) ? -1 : 1));

    if (!candidate) return;
    setRelativeDateAndDirection(() => [1, new Date(candidate.start_datetime)]);
    setHighlightedCourses([candidate]);
  };

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
                onSelect={(_d) => _d && setRelativeDateAndDirection(([_, d]) => [isAfter(_d, d) ? 1 : -1, _d])}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={onCalendarNext} variant="outline">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={relativeDate.toISOString()}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
              center: { zIndex: 1, x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d < 0 ? 1000 : -1000, opacity: 0, zIndex: 0 }),
            }}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <WeekCalendar
              courses={courses}
              highlightedCourses={highlightedCourses}
              onEditCb={fetchCourses}
              date={relativeDate}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(DashboardHomePage);
