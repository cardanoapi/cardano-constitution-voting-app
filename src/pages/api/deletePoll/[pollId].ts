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
 * Deletes a poll from the database
 * @returns PollId - The ID of the poll to delete
 * @returns Status - 200 if successful, 400 if the voting start failed from user input, 500 if the poll be deleted from an internal error
 */
export default async function deletePoll(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', 'DELETE');
      return res
        .status(405)
        .json({ success: false, message: 'Method not allowed' });
    }

    // TODO: Additional security step of verifying coordinator's signature before deleting poll
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'User is not logged in',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        success: false,
        message: 'User is not a convention organizer',
      });
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid pollId',
      });
    }

    await prisma.poll.delete({
      where: {
        id: BigInt(pollId),
      },
    });

    return res.status(200).json({ success: true, message: 'Poll deleted' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting Poll.',
    });
  }
}
