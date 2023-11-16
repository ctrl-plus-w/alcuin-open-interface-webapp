import { NextApiHandler } from 'next';

import { isDefined } from '@/utils/array.util';
import { prettifyCalendarName } from '@/utils/string.util';
import { addHours } from 'date-fns';
import { ICalCalendar } from 'ical-generator';

import { CoursesRepository } from '@/repository/CoursesRepository';

import withErrorHandler from '@/wrapper/withErrorHandler';

import { RessourceNotFoundError } from '@/class/ApiError';

import supabase from '@/instance/supabaseAdmin';

const coursesRepository = new CoursesRepository(supabase);

const handler: NextApiHandler = async (req, res) => {
  const { name } = req.query;

  if (!name || typeof name !== 'string') throw new RessourceNotFoundError('Name');

  const courses = await coursesRepository.getAllByProfessor(name, { disabled: false });

  const coursesWithoutDescription = courses.map((course) => ({ ...course, description: '' }));

  const filteredCourses = coursesWithoutDescription
    .map((course, index) => {
      const matcher = (_course: Database.ICourse) =>
        _course.start_datetime === course.start_datetime &&
        _course.end_datetime === course.end_datetime &&
        _course.location === course.location;

      const _index = coursesWithoutDescription.findIndex(matcher);

      const groups = coursesWithoutDescription.filter(matcher).map((c) => c.group);

      return _index === index ? { ...course, groups } : undefined;
    })
    .filter(isDefined);

  const cal = new ICalCalendar({
    name: 'Alcuin Open Calendar',
  });

  for (const course of filteredCourses) {
    const title = course.description !== '' ? `⚠ ${course.title}` : course.title;

    cal.createEvent({
      start: addHours(new Date(course.start_datetime), 1),
      end: addHours(new Date(course.end_datetime), 1),
      summary: `ESAIP | ${title} | ${course.groups.map(prettifyCalendarName).join(' - ')}`,
      description: course.description,
      location: course.location,
    });
  }

  cal.serve(res);
};

export default withErrorHandler(handler);
