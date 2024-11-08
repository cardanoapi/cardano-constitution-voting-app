// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import { checkIfCO } from '@/lib/checkIfCO';

const prisma = new PrismaClient();

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
  const { pollId } = req.body;
  // TODO: Additional security step of verifying coordinator's signature before deleting poll
  try {
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
