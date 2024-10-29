// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { Poll } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = { count: number; message?: string };

export default async function getPollVoteCount(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const pollId = req.query.pollId;
  if (typeof pollId !== 'string') {
    return res.status(400).json({
      count: 0,
      message: 'Invalid pollId',
    });
  }
  const votes = await prisma.poll_vote.findMany({
    where: {
      poll_id: BigInt(pollId),
    },
  });
  return res.status(200).json({ count: votes.length });
}
