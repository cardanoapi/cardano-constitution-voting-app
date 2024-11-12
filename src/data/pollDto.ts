import { prisma } from '@/db';

import type { Poll } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';
import { isValidPollStatus } from '@/lib/isValidPollStatus';

/**
 * Gets and formats data for a single poll
 * @param pollId - The ID of the poll to retrieve
 * @returns Formatted poll data
 */
export async function pollDto(pollId: string): Promise<Poll | null> {
  const poll = await prisma.poll.findFirst({
    where: {
      id: BigInt(pollId),
    },
  });

  const formattedPoll = convertBigIntsToStrings(poll);

  if (formattedPoll && !isValidPollStatus(formattedPoll)) {
    return null;
  }

  return formattedPoll;
}
