// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { poll, PrismaClient } from '@prisma/client';

import { Poll } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = Poll[];

export default async function getPolls(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const pollsJson = await prisma.poll.findMany({});
  const polls = parseJsonData(pollsJson);
  return res.status(200).json(polls);
}
