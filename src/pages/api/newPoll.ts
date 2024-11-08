// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

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
    const { name, description } = req.body;
    // TODO: Add session check to verify it is coordinator. Also additional security step of verifying coordinator's signature before creating poll?
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
    if (!description) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Description must be provided.',
      });
    }
    if (description.length > 255) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Description must be less than 10,000 characters.',
      });
    }

    const createdPoll = await prisma.poll.create({
      data: {
        name: name,
        description: description,
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
