// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import { pollResultsDto } from '@/data/pollResultsDto';

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
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res
        .status(405)
        .json({ votes: null, message: 'Method not allowed' });
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json({
        votes: null,
        message: 'Invalid pollId',
      });
    }

    const votes = await pollResultsDto(pollId);

    return res.status(200).json({
      votes: votes,
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
