// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
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
 * Moves a poll from pending to voting
 * @returns PollId - The ID of the poll to start voting on
 * @returns Status - 200 if successful, 400 if the voting start failed from user input, 500 if the poll couldn't start voting from an internal error
 */
export default async function startVoting(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'User is not logged in',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(req, res, stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        success: false,
        message: 'User is not a convention organizer',
      });
    }

    const { pollId } = req.body;

    // TODO: Additional security step of verifying coordinator's signature before updating poll?
    const findPoll = await prisma.poll.findFirst({
      where: {
        id: BigInt(pollId),
      },
    });
    if (findPoll === null) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }

    if (findPoll.status !== pollPhases.pending) {
      return res.status(400).json({
        success: false,
        message: 'Poll is not pending',
      });
    }

    // update poll status to voting
    await prisma.poll.update({
      where: {
        id: BigInt(pollId),
      },
      data: {
        status: 'voting',
      },
    });

    return res
      .status(200)
      .json({ success: true, message: 'Poll voting has begun' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error starting voting for Poll.',
    });
  }
}
