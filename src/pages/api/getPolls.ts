// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import * as Sentry from '@sentry/nextjs';

import { Poll } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

type Data = Poll[];

export default async function getPolls(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json([]);
    }
    const pollsJson = await prisma.poll.findMany({});
    const polls = parseJsonData(pollsJson);
    return res.status(200).json(polls);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
