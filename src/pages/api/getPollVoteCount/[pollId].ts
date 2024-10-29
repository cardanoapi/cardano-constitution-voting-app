// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = { count: number; message?: string };

/**
 * Gets the number of votes for a poll
 * @param pollId - The ID of the poll
 * @returns status - 200 if successful, 500 if poll vote count failed from an internal error
 * @returns message - An error message if getting the poll vote count failed from an internal error
 * @returns count - The number of votes for the poll, 0 if error encountered
 */
export default async function getPollVoteCount(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const pollId = req.query.pollId;
  try {
    if (typeof pollId !== 'string') {
      return res.status(400).json({
        count: 0,
        message: 'Invalid pollId',
      });
    }
    const votes = await prisma.poll_vote.findMany({
      where: {
        poll_id: BigInt(pollId),
      },
    });
    return res.status(200).json({ count: votes.length });
  } catch (error) {
    // TODO: Add sentry instead of console.error
    console.error('error', error);
    return res.status(500).json({
      count: 0,
      message: 'Error getting Poll Vote Count.',
    });
  }
}
