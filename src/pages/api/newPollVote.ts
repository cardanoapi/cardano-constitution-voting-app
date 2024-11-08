// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

import { verifyWallet } from '@/lib/verifyWallet';

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
    const { pollId, vote, signature } = req.body;

    const valid = await verifyWallet(
      signature.signature.payload,
      {
        signature: signature.signature.signedMessage.signature,
        key: signature.signature.signedMessage.key,
      },
      signature.challenge.challenge,
    );

    if (!valid) {
      res.status(401).json({
        success: false,
        message: 'Invalid signature.',
      });
    }

    // TODO: Make sure we trust where the stake address came from
    const user = await prisma.user.findFirst({
      where: {
        wallet_address: stakeAddress,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }
    if (user.is_delegate === false && user.is_alternate === false) {
      return res.status(401).json({
        success: false,
        message: 'You must be a Representative to vote.',
      });
    }

    const workshop = await prisma.workshop.findFirst({
      where: {
        id: BigInt(user.workshop_id),
      },
    });
    if (!workshop) {
      return res.status(401).json({
        success: false,
        message: 'Workshop not found.',
      });
    }
    if (workshop.active_voter_id !== user.id) {
      return res.status(401).json({
        success: false,
        message: `User is not the active voter for ${workshop.name} workshop.`,
      });
    }

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
          user_id: user.id,
        },
      },
      create: {
        poll_id: BigInt(pollId),
        user_id: user.id,
        vote: vote,
        signature: signature.signature.signedMessage.signature,
        hashed_message: signature.signature.payload,
      },
      update: {
        vote: vote,
        signature: signature.signature.signedMessage.signature,
        hashed_message: signature.signature.payload,
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
