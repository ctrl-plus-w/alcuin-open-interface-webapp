import { useEffect, useState } from 'react';

import DashboardLayout from '@/layout/DashboardLayout';

import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
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
import { Textarea } from '@/ui/textarea';
import { TypographyH4 } from '@/ui/typography';
import { useToast } from '@/ui/use-toast';

import withAuth from '@/wrapper/withAuth';

import useCoursesRepository from '@/hook/useCoursesRepository';

import { getDatesInRange } from '@/util/array.util';
import { getFirstDayOfWeek, getLastDayOfWorkingWeek, getSimpleTime, isSameDate } from '@/util/date.util';
import { onChange } from '@/util/react.util';

interface IProps {
  user: Database.IProfile;
}

const DashboardHomePage = ({ user }: IProps) => {
  const coursesRepository = useCoursesRepository();

  const { toastError } = useToast();

  const [group, setGroup] = useState<string | undefined>(undefined);
  const [courses, setCourses] = useState<Database.ICourse[]>([]);

  const [relativeDate, _setRelativeDate] = useState(new Date());
  // const [startDate, setStartDate] = useState(getFirstDayOfWeek(new Date()));
  // const [endDate, setEndDate] = useState(getLastDayOfWeek(new Date()));

  const [editingCourse, setEditingCourse] = useState<Database.ICourse | null>(null);
  const [notes, setNotes] = useState('');

  const onSubmit = async () => {
    if (!editingCourse) return;

    try {
      await coursesRepository.update(editingCourse.id, { description: notes });
      fetchCourses();
    } catch (error) {
      toastError(error);
    }
  };

  const fetchCourses = async () => {
    const _courses = await coursesRepository.getAll({ group });
    setCourses(_courses);
  };

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

  // const x = useTailwindBreakpoint();
  useEffect(() => {
    if (!group) return;

    fetchCourses();
  }, [group]);

  return (
    <DashboardLayout className="h-full flex flex-col gap-6 items-start justify-start">
      <div className="w-full flex justify-between">
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

        <Button variant="outline">{relativeDate.toLocaleDateString()}</Button>
      </div>

      <div className="flex divide-x divide-zinc-300 w-full h-full">
        {getDatesInRange(getFirstDayOfWeek(relativeDate), getLastDayOfWorkingWeek(relativeDate)).map((date, i, arr) => (
          <div
            key={i}
            className="flex flex-col gap-2 items-center flex-grow-0 w-full h-full p-4 first:pl-0 last:pr-0"
            style={{ width: `${(1 / arr.length) * 100}%` }}
          >
            <TypographyH4 className="mb-2">{date.toLocaleDateString()}</TypographyH4>

            {groupCoursesByTime(courses.filter((course) => isSameDate(new Date(course.start_datetime), date))).map(
              (courseGroup) => (
                <div key={courseGroup[0].start_datetime} className="flex w-full gap-2">
                  {courseGroup.map((course) => (
                    <Sheet
                      key={course.id}
                      onOpenChange={(value) => {
                        if (value) {
                          setNotes(course.description);
                          setEditingCourse(course);
                        }
                        return value;
                      }}
                    >
                      <SheetTrigger className="w-full bg-purple-200 rounded-md text-sm overflow-hidden">
                        <div className="flex flex-col items-start m-2">
                          <p className="truncate w-full text-left text-purple-700 font-semibold">
                            {course.description !== '' ? '⚠️ ' : ''}
                            {course.title}
                          </p>

                          <p className="text-purple-700 text-xs">{course.location}</p>
                          <p className="text-purple-700 text-xs">
                            {[course.start_datetime, course.end_datetime]
                              .map((d) => getSimpleTime(new Date(d)))
                              .join(' - ')}
                          </p>
                        </div>
                      </SheetTrigger>

                      <SheetContent className="flex flex-col gap-4">
                        <SheetHeader>
                          <SheetTitle>Modification des notes</SheetTitle>
                          <SheetDescription>
                            Lorsque vous ajoutez des notes sur un cours, ces notes seront vues par tous le monde,
                            veillez à revérifier ce que vous marquez avant d&apos;enregister vos modifications.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-col gap-1 w-full bg-purple-200 rounded-md p-2 overflow-hidden">
                          <p className="truncate w-full text-purple-700 font-semibold">
                            {course.description !== '' ? '⚠️ ' : ''}
                            {course.title}
                          </p>

                          <div className="flex w-full justify-between text-purple-700 text-sm">
                            <p>{course.location}</p>
                            <p>
                              {[course.start_datetime, course.end_datetime]
                                .map((d) => getSimpleTime(new Date(d)))
                                .join(' - ')}
                            </p>
                          </div>
                        </div>

                        <Label htmlFor="note">Notes</Label>
                        <Textarea id="notes" value={notes} onChange={onChange(setNotes)} />

                        <SheetFooter>
                          <SheetClose>
                            <Button onClick={onSubmit}>Modifier la note</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
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
