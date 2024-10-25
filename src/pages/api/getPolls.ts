// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { poll, PrismaClient } from '@prisma/client';

import { Poll } from '@/types';

const prisma = new PrismaClient();

type Data = Poll[];

export default async function getPolls(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const polls = await prisma.poll.findMany({});
  const pollJson = polls.map((poll) => ({
    id: poll.id.toString(),
    name: poll.name,
    description: poll.description || '',
    status: poll.status,
    summary_tx_id: poll.summary_tx_id || undefined,
  }));

  return res.status(200).json(pollJson);
}
