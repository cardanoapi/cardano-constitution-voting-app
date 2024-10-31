// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = { vote: string; message: string };

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
  const { params } = req.query;

  // Ensures params are an array of strings
  if (Array.isArray(params)) {
    params.forEach((param) => {
      if (typeof param !== 'string') {
        throw new Error('getPollVoteCount params array not of type string[]');
      }
    });
  } else {
    throw new Error('getPollVoteCount params not an array');
  }
  const userId = params[0];
  const pollId = params[1];

  try {
    const vote = await prisma.poll_vote.findFirst({
      where: {
        poll_id: BigInt(pollId),
        user_id: BigInt(userId),
      },
    });
    if (!vote) {
      return res.status(404).json({
        vote: '',
        message: 'Vote not found',
      });
    }
    return res.status(200).json({ vote: vote.vote, message: 'Vote found' });
  } catch (error) {
    // TODO: Add sentry instead of console.error
    console.error('error', error);
    return res.status(500).json({
      vote: '',
      message: 'Error getting Poll Vote.',
    });
  }
}
