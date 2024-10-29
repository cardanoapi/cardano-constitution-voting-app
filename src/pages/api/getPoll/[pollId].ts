// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { Poll } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = { poll?: Poll; message?: string };

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
  const pollId = req.query.pollId;
  try {
    if (typeof pollId !== 'string') {
      return res.status(400).json({
        message: 'Invalid pollId',
      });
    }
    const poll = await prisma.poll.findFirst({
      where: {
        id: BigInt(pollId),
      },
    });
    if (poll === null) {
      return res.status(404).json({
        message: 'Poll not found',
      });
    }
    const pollJson = parseJsonData(poll);
    return res.status(200).json(pollJson);
  } catch (error) {
    // TODO: Add sentry instead of console.error
    console.error('error', error);
    return res.status(500).json({
      message: 'Error getting Poll.',
    });
  }
}
