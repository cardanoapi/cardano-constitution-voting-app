// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  user: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      id: 1,
    },
  });
  return res.status(200).json({ user: user?.name || 'Could not find user' });
}
