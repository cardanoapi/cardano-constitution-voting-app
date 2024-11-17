import { prisma } from '@/db';

import type { Poll } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';
import { isValidPollStatus } from '@/lib/isValidPollStatus';

/**
 * Gets and formats all polls from the database
 * @returns {Promise<Poll[]>} - An array of Poll objects
 */
export async function pollsDto(): Promise<Poll[]> {
  const polls = await prisma.poll.findMany({
    where: {
      is_archived: false,
    },
  });
  const convertedPolls = convertBigIntsToStrings(polls);

  // Filter items to include only those with a valid poll status
  const verifiedPolls = [];
  for (const poll of convertedPolls) {
    if (isValidPollStatus(poll)) {
      verifiedPolls.push(poll);
    }
  }

  return verifiedPolls;
}
