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
 * Records a Poll Vote in the Database
 * @param pollId - The ID of the poll
 * @param vote - The vote to cast
 * @returns status - 200 if successful, 400 if the poll creation failed from user input, 500 if the poll creation failed from an internal error
 * @returns message - An error message if the poll creation failed from an internal error
 * @returns success - False if the poll creation failed from an internal error
 */
export default async function newPollVote(
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
    const { pollId, vote } = req.body;
    // TODO: Add session check to verify it is delegator/alternate. Also additional security step of verifying delegator/alternate's signature before casting vote
    // TODO: Add check that the delegate/alternate is the active voter for the convention location
    // TODO: Add data sanitization check. If fails sanitization return a message to the user.
    // validate poll id
    if (!pollId) {
      return res.status(400).json({
        success: false,
        message: 'Poll Id must be provided.',
      });
    }
    // validate vote
    if (!vote) {
      return res.status(400).json({
        success: false,
        message: 'Vote option must be provided.',
      });
    }
    if (vote !== 'yes' && vote !== 'no' && vote !== 'abstain') {
      return res.status(400).json({
        success: false,
        message: 'Vote option must be yes, no, or abstain.',
      });
    }
    // find poll
    const findPoll = await prisma.poll.findFirst({
      where: {
        id: BigInt(pollId),
      },
    });
    // ensure poll exists
    if (findPoll === null) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found',
      });
    }
    // ensure poll is voting
    if (findPoll.status !== pollPhases.voting) {
      return res.status(400).json({
        success: false,
        message: 'Poll is not voting',
      });
    }

    // create poll vote
    await prisma.poll_vote.upsert({
      where: {
        poll_id_user_id: {
          poll_id: BigInt(pollId),
          user_id: BigInt(9), // TODO: Replace with actual user ID
        },
      },
      create: {
        // TODO: ADD USER ID, SIGNATURE, AND HASH OF MESSAGE
        poll_id: BigInt(pollId),
        user_id: BigInt(9),
        vote: vote,
        signature: Date.now().toString(),
        hashed_message: Date.now().toString(),
      },
      update: {
        // TODO: ADD SIGNATURE, AND HASH OF MESSAGE
        vote: vote,
        signature: Date.now().toString(),
        hashed_message: Date.now().toString(),
      },
    });

    return res.status(200).json({ success: true, message: 'Vote recorded' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error voting on Poll.',
    });
  }
}
