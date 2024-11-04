// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

import { Poll } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = Poll[];

export default async function getPolls(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    const pollsJson = await prisma.poll.findMany({});
    const polls = parseJsonData(pollsJson);
    return res.status(200).json(polls);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
