import { NextApiHandler } from 'next';

import { addHours } from 'date-fns';
import { ICalCalendar } from 'ical-generator';

import { CoursesRepository } from '@/repository/CoursesRepository';

import withErrorHandler from '@/wrapper/withErrorHandler';

import { RessourceNotFoundError } from '@/class/ApiError';

import supabase from '@/instance/supabaseAdmin';

import config from '@/constant/Config';
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
      start: addHours(new Date(course.start_datetime), config.ADD_HOURS_OFFSET),
      end: addHours(new Date(course.end_datetime), config.ADD_HOURS_OFFSET),
      // start: new Date(course.start_datetime),
      // end: new Date(course.end_datetime),
      summary: title,
      description: course.description,
      location: course.location,
    });
  }

  cal.serve(res);
};

export default withErrorHandler(handler);
