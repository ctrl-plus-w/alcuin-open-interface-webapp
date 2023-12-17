import { Session } from '@supabase/supabase-js';

/**
 * Return whether the two sessions are equal or not (shallow comparison).
 * @param session1 The first session
 * @param session2 The second session
 */
export const shallowCompareSessions = (session1: Session | null, session2: Session | null): boolean => {
  if (!session1 && !session2) return true;
  if (!session1 || !session2) return false;

  if (session2.access_token !== session1.access_token) return false;
  if (session2.refresh_token !== session1.refresh_token) return false;
  if (session2.token_type !== session1.token_type) return false;

  return session2.user.id === session1.user.id;
};
