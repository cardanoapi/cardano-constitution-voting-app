// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import type { Poll } from '@/types';
import { pollDto } from '@/data/pollDto';
import { isValidPollStatus } from '@/lib/isValidPollStatus';

type Data = { poll: Poll | null; message: string };

/**
 * Gets all data for a poll
 * @param pollId - The ID of the poll
 * @returns status - 200 if successful, 400 if pollId is invalid, 404 if poll is not found, 500 if poll fetching failed from an internal error
 * @returns message - An error message if getting the poll vote count failed from an internal error
 * @returns poll - The poll data, null if error encountered
 */
export default async function getPoll(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res
        .status(405)
        .json({ poll: null, message: 'Method not allowed' });
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json({
        poll: null,
        message: 'Invalid pollId',
      });
    }

    const poll = await pollDto(pollId);

    if (poll === null) {
      return res.status(404).json({
        poll: null,
        message: 'Poll not found',
      });
    }

    if (!isValidPollStatus(poll)) {
      return res.status(400).json({
        poll: null,
        message: 'Invalid poll status',
      });
    }

    return res.status(200).json({ poll: poll, message: 'Poll found' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      message: 'Error getting Poll.',
      poll: null,
    });
  }
}
