// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import { checkIfCO } from '@/lib/checkIfCO';

type Data = {
  success: boolean;
  message: string;
};
/**
 * Archives a poll in the database
 * @returns Success - True if poll was successfully archived, false otherwise
 * @returns Message - An error message if archiving poll failed
 * @returns Status - 200 if successful, 400 if the failed from user input, 500 if failed from an internal error
 */
export default async function archivePoll(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res
        .status(405)
        .json({ success: false, message: 'Method not allowed' });
    }
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        message:
          'You must be logged in as a Convention Organizer to archive a poll.',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        success: false,
        message: 'You must be a Convention Organizer to archive a poll.',
      });
    }

    const { pollId } = req.body;
    if (typeof pollId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid pollId',
      });
    }

    // TODO: Also additional security step of verifying coordinator's signature before archiving poll?

    const archivedPoll = await prisma.poll.update({
      where: {
        id: BigInt(pollId),
      },
      data: {
        is_archived: true,
      },
    });
    if (!archivedPoll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Poll archived',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error archiving poll.',
    });
  }
}
