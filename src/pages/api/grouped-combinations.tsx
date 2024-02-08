import { NextApiHandler } from 'next';

import { CoursesRepository } from '@/repository/CoursesRepository';

import supabase from '@/instance/supabaseAdmin';

import { equalFlat } from '@/util/array.util';

import CALENDARS from '@/constant/Calendars';

const coursesRepository = new CoursesRepository(supabase);

type CourseGroup = Record<string, Database.ICourse[]>;

/**
 * Group the course by their start and end time (the key will be the start and end date joined with a ! in between)
 * @param courses The courses to group
 */
const groupCoursesByTime = (courses: Database.ICourse[]) => {
  const res: CourseGroup = {};

  for (const course of courses) {
    const key = `${course.start_datetime}!${course.end_datetime}`;

    if (key in res) res[key].push(course);
    else res[key] = [course];
  }

  return res;
};

/**
 * Filter the grouped courses to keep only the groups that contains more than one course
 * @param groups The courses groups
 */
const filterMultipleCoursesGroup = (groups: CourseGroup) => {
  const res: CourseGroup = {};

  for (const group in groups) {
    if (groups[group].length > 1) res[group] = groups[group];
  }

  return res;
};

/**
 * From the groups generated, return the combinations of names of the courses as unique
 * @param groups The courses groups
 */
const getCombinationsFromCoursesGroups = (groups: CourseGroup): string[][] => {
  const combinations: string[][] = [];

  for (const key in groups) {
    const combination = groups[key].map((course) => course.title);
    if (!combinations.some((comb) => equalFlat(comb, combination))) combinations.push(combination);
  }

  return combinations;
};

/**
 * From the grouped courses, remove the courses that are TA or TAC (autonomous work)
 * @param groups The courses groups
 */
const filterTACourses = (groups: CourseGroup) => {
  const res: CourseGroup = {};

  for (const group in groups) {
    res[group] = groups[group].filter((course) => !course.title.startsWith('TA'));
  }

  return res;
};

/**
 * From a list of courses, return the combinations of names of the courses that overlap
 * @param courses The courses
 */
const getCombinationsFromCourses = (courses: Database.ICourse[]): string[][] => {
  return getCombinationsFromCoursesGroups(filterMultipleCoursesGroup(filterTACourses(groupCoursesByTime(courses))));
};

const handler: NextApiHandler = async (req, res) => {
  const groups = Object.values(CALENDARS).reduce((acc, curr) => [...acc, ...curr], []);

  const groupCombinations: Record<string, string[][]> = {};

  for (const group of groups) {
    const courses = await coursesRepository.getAll({ group, disabled: false });
    groupCombinations[group] = getCombinationsFromCourses(courses);
  }

  res.status(200).json(groupCombinations);
};

export default handler;
