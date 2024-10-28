// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { Poll } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = { poll?: Poll; message?: string };

export default async function getPoll(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const pollId = req.query.pollId;
  if (typeof pollId !== 'string') {
    return res.status(400).json({
      message: 'Invalid pollId',
    });
  }
  const poll = await prisma.poll.findFirst({
    where: {
      id: BigInt(pollId),
    },
  });
  if (poll === null) {
    return res.status(404).json({
      message: 'Poll not found',
    });
  }
  const pollJson = parseJsonData(poll);
  return res.status(200).json(pollJson);
}
