import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import { Parser } from '@json2csv/plainjs';
import * as Sentry from '@sentry/nextjs';

import { pollDto } from '@/data/pollDto';

/**
 * Generates excel file with a single poll's votes
 * @param req - Request object
 * @param res - Response object
 * @returns 405 if not POST request, 500 if error, 200 if successful
 */
const downloadPollVotes = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void | NextApiResponse> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res
        .status(405)
        .json({ success: false, message: 'Method not allowed' });
    }

    const pollId = req.body.pollId as string;
    if (!pollId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing pollId' });
    }

    const poll = await pollDto(pollId);
    if (poll?.status !== 'concluded') {
      return res
        .status(400)
        .json({ success: false, message: 'Poll is not concluded' });
    }

    const pollVotes = await prisma.poll_vote.findMany({
      where: {
        poll_id: BigInt(pollId),
      },
      include: {
        poll_transaction: true,
        user: true,
      },
    });

    const workshops = await prisma.workshop.findMany();

    const results: {
      user: string;
      walletAddress: string;
      workshop: string;
      delegateOrAlternate: string;
      vote: string;
      signature: string;
      message: string;
      txId: string;
    }[] = [];

    for (const vote of pollVotes) {
      const workshopName = workshops.find(
        (workshop) => workshop.id === vote.user.workshop_id,
      )?.name;

      results.push({
        user: vote.user.name,
        walletAddress: vote.user.wallet_address,
        workshop: workshopName || 'Unknown Workshop',
        delegateOrAlternate: vote.user.is_delegate ? 'Delegate' : 'Alternate',
        vote: vote.vote,
        signature: vote.signature,
        message: vote.hashed_message,
        txId: vote.poll_transaction?.transaction_id || '',
      });
    }

    const opts = {
      fields: [
        'user',
        'walletAddress',
        'workshop',
        'delegateOrAlternate',
        'vote',
        'signature',
        'message',
        'txId',
      ],
    };
    const parser = new Parser(opts);
    const csv = parser.parse(results);

    // Set headers to prompt download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('file-name', `${poll.name || 'Unknown Poll'} votes.csv`);

    return res.status(200).send(csv);
  } catch (err) {
    Sentry.captureException(err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to create CSV file' });
  }
};

export default downloadPollVotes;
