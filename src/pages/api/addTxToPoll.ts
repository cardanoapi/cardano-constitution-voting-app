// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
import { prisma } from '@/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import { pollDto } from '@/data/pollDto';
import { checkIfCO } from '@/lib/checkIfCO';

type Data = {
  success: boolean;
  message: string;
};
/**
 * Adds the summary TX ID to the poll table
 * @returns success - True if the TX was successfully added, false otherwise
 * @returns Message - An error message if the TX was not successfully added
 * @returns Status - 200 if successful, 400 if failed from user input, 500 if failed from an internal error
 */
export default async function addTxToPoll(
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

    const { pollId, txId } = req.body;
    if (
      !pollId ||
      typeof pollId !== 'string' ||
      !txId ||
      typeof txId !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Poll ID and TX ID must be provided.',
      });
    }

    const poll = await pollDto(pollId);
    if (!poll || poll.status !== pollPhases.concluded) {
      return res.status(400).json({
        success: false,
        message: 'Poll does not exist or is not concluded.',
      });
    }

    const updatedPoll = await prisma.poll.update({
      where: {
        id: BigInt(pollId),
      },
      data: {
        summary_tx_id: txId,
      },
    });

    if (updatedPoll.summary_tx_id !== txId) {
      return res.status(500).json({
        success: false,
        message: 'Error updating summary TX for poll.',
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'TX ID saved',
      });
    }
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      success: false,
      message: 'Error saving TX ID.',
    });
  }
}
