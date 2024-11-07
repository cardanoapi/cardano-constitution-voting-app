// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

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
  // TODO: Add session check to verify it is coordinator. Also additional security step of verifying coordinator's signature before deleting poll
  try {
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
