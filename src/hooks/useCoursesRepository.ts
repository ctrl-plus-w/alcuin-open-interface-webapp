import { useState } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { CoursesRepository } from '@/repository/CoursesRepository';

const useCoursesRepository = () => {
  const supabase = useSupabaseClient();

  const [coursesRepository] = useState(() => new CoursesRepository(supabase));

  return coursesRepository;
};

export default useCoursesRepository;
