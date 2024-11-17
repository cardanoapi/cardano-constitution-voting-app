// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import { pollVoteCountDto } from '@/data/pollVoteCountDto';

type Data = { count: number; message: string };

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
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ count: 0, message: 'Method not allowed' });
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json({
        count: 0,
        message: 'Invalid pollId',
      });
    }

    const voteCount = await pollVoteCountDto(pollId);

    return res
      .status(200)
      .json({ count: voteCount, message: 'Poll vote count retrieved' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      count: 0,
      message: 'Error getting Poll Vote Count.',
    });
  }
}
