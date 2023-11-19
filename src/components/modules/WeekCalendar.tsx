import { useMemo } from 'react';

import CardGroup from '@/components/features/courses/card-group';
import { addDays, format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';

import { TypographyH4 } from '@/ui/typography';

import useTailwindBreakpoint from '@/hook/useTailwindBreakpoints';

import { getDatesInRange } from '@/util/array.util';
import { getFirstDayOfWeek, getLastDayOfWorkingWeek, getNextMondayIfWeekEnd, isSameDate } from '@/util/date.util';

import { cn } from '@/lib/utils';

interface IProps {
  date: Date;
  direction: 1 | -1;

  courses: Database.ICourse[];
  highlightedCourses?: Database.ICourse[];

  onEditCb?: VoidFunction;

  className?: string;
}

const WeekCalendar = ({ direction, courses, date: _date, highlightedCourses = [], onEditCb, className }: IProps) => {
  const date = useMemo(() => getNextMondayIfWeekEnd(_date), [_date]);

  const breakpoint = useTailwindBreakpoint();

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

  const [startDate, endDate] = useMemo(() => {
    if (['sm', 'md', 'lg'].includes(breakpoint)) {
      return [date, date];
    } else if (['xl'].includes(breakpoint)) {
      return [subDays(date, 1), addDays(date, 1)];
    } else {
      return [getFirstDayOfWeek(date), getLastDayOfWorkingWeek(date)];
    }
  }, [date, breakpoint]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={date.toISOString()}
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
          <div className={cn('flex divide-x divide-zinc-300 w-full h-full', className)}>
            {getDatesInRange(startDate, endDate).map((date, i, arr) => (
              <div
                key={i}
                className="flex flex-col gap-2 items-center flex-grow-0 w-full h-full p-4 first:pl-0 last:pr-0"
                style={{ width: `${(1 / arr.length) * 100}%` }}
              >
                <TypographyH4 className="mb-2">{format(date, 'EEE dd LLLL', { locale: fr })}</TypographyH4>

                {groupCoursesByTime(courses.filter((course) => isSameDate(new Date(course.start_datetime), date))).map(
                  (courseGroup) => (
                    <CardGroup
                      courses={courseGroup}
                      onEditCb={onEditCb}
                      highlightedCourses={highlightedCourses}
                      key={courseGroup[0].start_datetime}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WeekCalendar;
