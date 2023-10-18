import { useState } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { ProfilesRepository } from '@/repository/ProfilesRepository';

const useProfilesRepository = () => {
  const supabase = useSupabaseClient();

  const [profilesRepository] = useState(() => new ProfilesRepository(supabase));

  return profilesRepository;
};

export default useProfilesRepository;
