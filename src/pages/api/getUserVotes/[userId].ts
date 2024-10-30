// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { PollVote, User } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = {
  votes: PollVote[];
  message: string;
};

/**
 * Gets all of a users votes
 * @param userId - The ID of the user
 * @returns status - 200 if successful, 400 if userId is invalid, 404 if user votes not found, 500 if user votes fetching failed from an internal error
 * @returns message - An error message if getting the user votes failed
 * @returns votes - The array of poll votes with this user's user_id, empty array if error encountered
 */
export default async function getUserVotes(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ votes: [], message: 'Method not allowed' });
    }
    const userId = req.query.userId;
    if (typeof userId !== 'string') {
      return res
        .status(400)
        .json({ votes: [], message: 'Invalid query userId' });
    }
    const votes = await prisma.poll_vote.findMany({
      where: {
        user_id: BigInt(userId),
      },
    });
    if (!votes) {
      return res.status(404).json({ votes: [], message: 'Votes not found' });
    }
    const votesJson = parseJsonData(votes);
    return res.status(200).json({ votes: votesJson, message: 'Found user' });
  } catch (error) {
    return res.status(500).json({ votes: [], message: 'Error fetching user' });
  }
}
