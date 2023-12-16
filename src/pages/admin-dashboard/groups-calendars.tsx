import { useEffect, useMemo, useState } from 'react';

import Head from 'next/head';

import { prettifyCalendarName } from '@/utils/string.util';

import AdminDashboardLayout from '@/layout/AdminDashboardLayout';

import DatePicker from '@/module/DatePicker';
import WeekCalendar from '@/module/WeekCalendar';

import Combobox from '@/element/ComboBox';

import withAuth from '@/wrapper/withAuth';

import useCoursesRepository from '@/hook/useCoursesRepository';

import CALENDARS from '@/constant/Calendars';

const AdminGroupsCalendarsPage = () => {
  const coursesRepository = useCoursesRepository();

  const [currentCategory, setCurrentCategory] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const [courses, setCourses] = useState<Database.ICourse[]>([]);

  const [relativeDate, setRelativeData] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentValue('');
  }, [currentCategory]);

  const dropdownCategoriesValues = useMemo(() => {
    return Object.keys(CALENDARS).map((value) => ({ value: value.toLocaleLowerCase(), label: value }));
  }, []);

  const dropdownValues = useMemo(() => {
    const category = dropdownCategoriesValues.find(({ value }) => value === currentCategory);
    if (!category) return [];

    const calendars = CALENDARS[category.label as keyof typeof CALENDARS];

    return calendars.map((calendar) => ({
      value: prettifyCalendarName(calendar).toLocaleLowerCase(),
      label: prettifyCalendarName(calendar),
      calendar: calendar,
    }));
  }, [currentCategory, dropdownCategoriesValues]);

  /**
   * Fetch the courses of the selected group (not disabled)
   */
  const fetchCourses = async () => {
    const calendar = dropdownValues.find(({ value }) => value === currentValue);
    if (!calendar) return;

    const group = calendar.calendar;

    const _courses = await coursesRepository.getAll({ group, disabled: false });
    setCourses(_courses);
  };

  /**
   * Fetch the courses when the group change
   */
  useEffect(() => {
    if (!currentValue) return;

    fetchCourses().then();
  }, [currentValue]);

  return (
    <AdminDashboardLayout className="h-full flex flex-col gap-6 items-start justify-start">
      <Head>
        <title>Dashboard - Calendriers de groupe</title>
      </Head>

      <div className="w-full flex flex-col md:flex-row justify-between gap-4">
        <Combobox
          values={dropdownCategoriesValues}
          placeholder="Sélectionner la catégorie"
          {...{ currentValue: currentCategory, setCurrentValue: setCurrentCategory }}
        />
        {currentCategory !== '' && (
          <Combobox
            values={dropdownValues}
            placeholder="Sélectionner la filière."
            {...{ currentValue, setCurrentValue }}
          />
        )}

        <DatePicker relativeDate={relativeDate} setRelativeDate={setRelativeData} />
      </div>

      <WeekCalendar date={relativeDate} courses={courses} onEditCb={fetchCourses} />
    </AdminDashboardLayout>
  );
};

export default withAuth(AdminGroupsCalendarsPage);
