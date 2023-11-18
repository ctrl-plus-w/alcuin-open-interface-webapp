import { useState } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { GradesRepository } from '@/repository/GradesRepository';

const useGradesRepository = () => {
  const supabase = useSupabaseClient();

  const [gradesRepository] = useState(() => new GradesRepository(supabase));

  return gradesRepository;
};

export default useGradesRepository;
