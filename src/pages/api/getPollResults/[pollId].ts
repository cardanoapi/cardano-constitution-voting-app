// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = {
  votes: {
    [key: string]: {
      name: string;
      id: string;
    }[];
  } | null;
  message: string;
};

/**
 * Gets the names & ids of all votes for a poll grouped by vote
 * @param pollId - The ID of the poll
 * @returns status - 200 if successful, 400 if poll is not concluded or doesn't exist, 500 if getting poll results failed from an internal error
 * @returns message - An error message if getting the poll results failed
 * @returns votes - An object with an array of votes & corresponding voter names & ids
 */
export default async function getPollResults(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const pollId = req.query.pollId;
  try {
    if (typeof pollId !== 'string') {
      return res.status(400).json({
        votes: null,
        message: 'Invalid pollId',
      });
    }
    const votes = await prisma.poll_vote.findMany({
      where: {
        poll_id: BigInt(pollId),
        poll: {
          status: 'concluded',
        },
      },
      select: {
        user_id: true,
        vote: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    const votesJson = parseJsonData(votes);

    const transformedVotes = votesJson.reduce(
      (
        acc: {
          [key: string]: {
            name: string;
            id: string;
          }[];
        },
        {
          user,
          user_id,
          vote,
        }: { user: { name: string }; user_id: string; vote: string },
      ) => {
        // Initialize the array for each vote choice if it doesn't exist
        if (!acc[vote]) {
          acc[vote] = [];
        }

        // Add the user object to the appropriate vote choice array
        acc[vote].push({
          name: user.name,
          id: user_id,
        });

        return acc;
      },
      { yes: [], no: [], abstain: [] },
    );

    return res.status(200).json({
      votes: transformedVotes,
      message: 'Poll vote count retrieved',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      votes: null,
      message: 'Error getting Poll Vote Count.',
    });
  }
}
