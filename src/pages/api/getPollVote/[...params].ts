// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import { pollVoteDto } from '@/data/pollVoteDto';

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
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ vote: '', message: 'Method not allowed' });
    }
    const { params } = req.query;

    // Ensures params are an array of strings
    if (Array.isArray(params)) {
      params.forEach((param) => {
        if (typeof param !== 'string') {
          return res.status(400).json({ vote: '', message: 'Invalid params' });
        }
      });
    } else {
      return res.status(400).json({ vote: '', message: 'Invalid params' });
    }

    const userId = params[0];
    const pollId = params[1];

    const vote = await pollVoteDto(userId, pollId);

    if (!vote) {
      return res.status(404).json({
        vote: '',
        message: 'Vote not found',
      });
    }

    return res.status(200).json({ vote: vote, message: 'Vote found' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      vote: '',
      message: 'Error getting Poll Vote.',
    });
  }
}
