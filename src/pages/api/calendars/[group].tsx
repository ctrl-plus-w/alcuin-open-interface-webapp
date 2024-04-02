import { NextApiHandler } from 'next';

import { ICalCalendar } from 'ical-generator';

import { CoursesRepository } from '@/repository/CoursesRepository';

import withErrorHandler from '@/wrapper/withErrorHandler';

import { RessourceNotFoundError } from '@/class/ApiError';

import supabase from '@/instance/supabaseAdmin';

import GROUPS from '@/constant/Groups';

const coursesRepository = new CoursesRepository(supabase);

const handler: NextApiHandler = async (req, res) => {
  const group = req.query.group as string;

  if (!GROUPS.includes(group)) throw new RessourceNotFoundError('Group');

  const courses = await coursesRepository.getAll({ group, disabled: false });

  const cal = new ICalCalendar({
    name: 'Alcuin Open Calendar',
  });

  for (const course of courses) {
    const title = course.description !== '' ? `⚠ ${course.title}` : course.title;

    cal.createEvent({
      // start: addHours(new Date(course.start_datetime), 1),
      // end: addHours(new Date(course.end_datetime), 1),
      start: new Date(course.start_datetime),
      end: new Date(course.end_datetime),
      summary: title,
      description: course.description,
      location: course.location,
    });
  }

  cal.serve(res);
};

export default withErrorHandler(handler);
