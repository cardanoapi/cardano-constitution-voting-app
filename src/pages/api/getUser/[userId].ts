// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { User } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = {
  user: User | null;
  message: string;
};

/**
 * Gets user data by UserId
 * @param userId - The ID of the user
 * @returns status - 200 if successful, 400 if userId is invalid, 404 if user is not found, 500 if user fetching failed from an internal error
 * @returns message - An error message if getting the user data failed
 * @returns user - The user data, null if error encountered
 */
export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res
        .status(405)
        .json({ user: null, message: 'Method not allowed' });
    }
    const userId = req.query.userId;
    if (typeof userId !== 'string') {
      return res
        .status(400)
        .json({ user: null, message: 'Invalid query userId' });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: BigInt(userId),
      },
    });
    if (!user) {
      return res.status(404).json({ user: null, message: 'User not found' });
    }
    const userJson = parseJsonData(user);
    return res.status(200).json({ user: userJson, message: 'Found user' });
  } catch (error) {
    // TODO: Add proper error handling
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json({ user: null, message: 'Error fetching user' });
  }
}
