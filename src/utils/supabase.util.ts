import { Session } from '@supabase/supabase-js';

export const shallowCompareSessions = (s1: Session | null, s2: Session | null): boolean => {
  if (!s1 && !s2) return true;
  if (!s1 || !s2) return false;

  if (s2.access_token !== s1.access_token) return false;
  if (s2.refresh_token !== s1.refresh_token) return false;
  if (s2.token_type !== s1.token_type) return false;
  if (s2.user.id !== s1.user.id) return false;

  return true;
};
