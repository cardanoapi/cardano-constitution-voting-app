import { pollPhases } from '@/constants/pollPhases';

import type { Poll } from '@/types';

/**
 * Verifies that the status of a poll is valid
 * @param poll - Poll object
 * @returns True if the status is valid, false otherwise
 */
export function isValidPollStatus(poll: {
  status: string;
  id: string;
  name: string;
  description: string | null;
  summary_tx_id: string | null;
}): poll is Poll & { status: 'pending' | 'voting' | 'concluded' } {
  return Object.keys(pollPhases).includes(poll.status);
}
