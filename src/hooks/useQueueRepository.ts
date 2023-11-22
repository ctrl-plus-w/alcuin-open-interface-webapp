import { useState } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { QueueRepository } from '@/repository/QueueRepository';

const useQueueRepository = () => {
  const supabase = useSupabaseClient();

  const [queueRepository] = useState(() => new QueueRepository(supabase));

  return queueRepository;
};

export default useQueueRepository;
