// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

type Data = {
  success: boolean;
  message: string;
};
/**
 * Moves a poll from voting to concluded
 * @returns PollId - The ID of the poll to start voting on
 * @returns Status - 200 if successful, 400 if the ending vote failed from user input, 500 if the ending vote  failed from an internal error
 */
export default async function endVoting(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    const { pollId } = req.body;
    // TODO: Add session check to verify it is coordinator. Also additional security step of verifying coordinator's signature before updating poll?
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

    if (findPoll.status !== pollPhases.voting) {
      return res.status(400).json({
        success: false,
        message: 'Poll is not voting',
      });
    }

    // update poll status to concluded
    await prisma.poll.update({
      where: {
        id: BigInt(pollId),
      },
      data: {
        status: pollPhases.concluded,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: 'Voting ended for poll' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error ending voting for Poll.',
    });
  }
}
