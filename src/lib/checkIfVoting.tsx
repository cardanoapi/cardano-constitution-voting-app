import { prisma } from '@/db';

/**
 * Checks if there are any actively voting polls
 * @param req - NextApiRequest
 * @param res - NextApiResponse
 * @returns Boolean - True if a poll is actively voting, false otherwise
 */
export async function checkIfVoting(): Promise<boolean> {
  const polls = await prisma.poll.findMany({
    where: {
      status: 'voting',
    },
  });
  if (polls.length > 0) {
    return true;
  } else {
    return false;
  }
}
