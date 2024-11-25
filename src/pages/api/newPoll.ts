// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import { checkIfCO } from '@/lib/checkIfCO';

type Data = {
  pollId: string;
  message?: string;
};
/**
 * Creates a New Poll with status 'pending' in the Database.
 * @returns PollId - The ID of the newly created poll
 * @returns Message - An error message if the poll creation failed
 * @returns Status - 200 if successful, 400 if the poll creation failed from user input, 500 if the poll creation failed from an internal error
 */
export default async function newPoll(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res
        .status(405)
        .json({ pollId: BigInt(-1).toString(), message: 'Method not allowed' });
    }
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        pollId: BigInt(-1).toString(),
        message: 'User is not logged in',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        pollId: BigInt(-1).toString(),
        message: 'User is not a convention organizer',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        wallet_address: stakeAddress,
      },
    });
    if (!user || !user.is_convention_organizer) {
      return res.status(401).json({
        pollId: BigInt(-1).toString(),
        message: 'User is not a convention organizer',
      });
    }

    // make sure there are no pending or voting polls
    const polls = await prisma.poll.findMany({
      where: {
        status: {
          in: ['pending', 'voting'],
        },
        is_archived: false,
      },
    });
    if (polls.length > 0) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message:
          'You cannot create a new poll while there are pending or voting polls. End any open poll then return to this page to create a new poll.',
      });
    }

    const { name, hashedText, link } = req.body;
    // TODO: Additional security step of verifying coordinator's signature before creating poll?
    // TODO: Add data sanitization check. If fails sanitization return a message to the user.
    // validate name
    if (!name) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Name must be provided.',
      });
    }
    if (name.length > 255) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Name must be less than 255 characters.',
      });
    }
    // validate description
    if (!hashedText) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Hashed Constitution Text must be provided.',
      });
    }
    if (hashedText.length > 100) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Hashed Constitution Text should be a 64 byte string.',
      });
    }
    // validate link
    if (!link) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Link must be provided.',
      });
    }
    if (link.length > 1000) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Link must be less than 1000 characters.',
      });
    }
    const urlPattern =
      /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[\w.-]*)*(\?.*)?(#.*)?$/i;
    const urlValid = urlPattern.test(link);
    if (!urlValid) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Link must be a valid URL. (https://...)',
      });
    }

    const createdPoll = await prisma.poll.create({
      data: {
        name: name,
        hashedText: hashedText,
        link: link,
        status: 'pending',
      },
    });
    return res.status(200).json({ pollId: createdPoll.id.toString() });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      pollId: BigInt(-1).toString(),
      message: 'Error creating new Poll.',
    });
  }
}
