// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
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
 * Adds a TX ID to all user votes in a poll
 * @returns success - True if the TX was successfully added, false otherwise
 * @returns Message - An error message if the TX was not successfully added
 * @returns Status - 200 if successful, 400 if failed from user input, 500 if failed from an internal error
 */
export default async function addTxToPollVotes(
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

    const { userIds, pollId, pollTransactionId } = req.body;

    if (!userIds) {
      return res.status(400).json({
        success: false,
        message: 'User IDs must be provided.',
      });
    }

    for (const userId of userIds) {
      if (typeof userId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'User IDs must be strings.',
        });
      }
    }

    if (
      !pollId ||
      typeof pollId !== 'string' ||
      !pollTransactionId ||
      typeof pollTransactionId !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Poll ID and TX ID must be provided.',
      });
    }

    const poll = await prisma.poll.findUnique({
      where: {
        id: BigInt(pollId),
      },
    });
    if (!poll || poll.status !== pollPhases.concluded) {
      return res.status(400).json({
        success: false,
        message: 'Poll does not exist or is not concluded.',
      });
    }

    for (const userId of userIds) {
      await prisma.poll_vote.update({
        where: {
          poll_id_user_id: {
            poll_id: BigInt(pollId),
            user_id: BigInt(userId),
          },
        },
        data: {
          poll_transaction_id: BigInt(pollTransactionId),
        },
      });
    }

    return res.status(200).json({ success: true, message: 'TX ID saved' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error saving TX ID.',
    });
  }
}
