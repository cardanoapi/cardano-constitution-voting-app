import { prisma } from '@/db';

/**
 * Gets and formats the vote of a user for a poll from the DB
 * @param userId - The ID of the user
 * @param pollId - The ID of the poll
 * @returns String indicating how the user voted
 */
export async function pollVoteDto(
  userId: string,
  pollId: string,
): Promise<string | null> {
  const vote = await prisma.poll_vote.findFirst({
    where: {
      poll_id: BigInt(pollId),
      user_id: BigInt(userId),
    },
  });

  if (vote) {
    return vote.vote;
  } else {
    return null;
  }
}
