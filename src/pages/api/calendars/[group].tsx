import { NextApiHandler } from 'next';

import { addHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
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
    timezone: 'Europe/Paris',
  });

  for (const course of courses) {
    const title = course.description !== '' ? `⚠ ${course.title}` : course.title;

    cal.createEvent({
      start: addHours(toZonedTime(course.start_datetime, 'Europe/Paris'), 1),
      end: addHours(toZonedTime(course.end_datetime, 'Europe/Paris'), 1),
      summary: title,
      description: course.description,
      location: course.location,
    });
  }

  cal.serve(res);
};

export default withErrorHandler(handler);
