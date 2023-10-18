import { useState } from 'react';

import { CoursesRepository } from '@/repositories/CoursesRepository';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const useCoursesRepository = () => {
  const supabase = useSupabaseClient();

  const [coursesRepository] = useState(() => new CoursesRepository(supabase));

  return coursesRepository;
};

export default useCoursesRepository;
