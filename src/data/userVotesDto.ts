import { pollPhases } from '@/constants/pollPhases';
import { prisma } from '@/db';

import { PollVote } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formates all of a single user's votes
 * @param userId - The ID of the user
 * @returns User's votes
 */
export async function userVotesDto(userId: string): Promise<PollVote[]> {
  const votes = await prisma.poll_vote.findMany({
    where: {
      user_id: BigInt(userId),
      poll: {
        status: pollPhases.concluded,
      },
    },
  });

  const convertedVotes = convertBigIntsToStrings(votes);

  return convertedVotes;
}
