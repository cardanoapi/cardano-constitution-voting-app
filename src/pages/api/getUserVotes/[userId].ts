// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
import { prisma } from '@/db';
import * as Sentry from '@sentry/nextjs';

import type { PollVote } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

type Data = {
  votes: PollVote[];
  message: string;
};

/**
 * Gets all of a users votes
 * @param userId - The ID of the user
 * @returns status - 200 if successful, 400 if userId is invalid, 404 if user votes not found, 500 if user votes fetching failed from an internal error
 * @returns message - An error message if getting the user votes failed
 * @returns votes - The array of poll votes with this user's user_id, empty array if error encountered
 */
export default async function getUserVotes(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ votes: [], message: 'Method not allowed' });
    }

    const userId = req.query.userId;

    if (typeof userId !== 'string') {
      return res
        .status(400)
        .json({ votes: [], message: 'Invalid query userId' });
    }

    const votes = await prisma.poll_vote.findMany({
      where: {
        user_id: BigInt(userId),
        poll: {
          status: pollPhases.concluded,
        },
      },
    });

    if (!votes) {
      return res.status(404).json({ votes: [], message: 'Votes not found' });
    }

    const convertedVotes = convertBigIntsToStrings(votes);

    return res
      .status(200)
      .json({ votes: convertedVotes, message: 'Found user votes' });
  } catch (error) {
    Sentry.captureException(error);
    return res
      .status(500)
      .json({ votes: [], message: 'Error fetching user votes' });
  }
}
