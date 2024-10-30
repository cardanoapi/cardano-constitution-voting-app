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
    return res.status(500).json({ user: null, message: 'Error fetching user' });
  }
}
