import { prisma } from '@/db';

/**
 * Gets the number of unique voters for a poll.
 * @param pollId - The poll id
 * @returns Number of unique voters for the poll
 */
export async function pollVoteCountDto(pollId: string): Promise<number> {
  const votes = await prisma.poll_vote.findMany({
    where: {
      poll_id: BigInt(pollId),
    },
  });

  return votes.length;
}
