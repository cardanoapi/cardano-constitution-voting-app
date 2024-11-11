// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import * as Sentry from '@sentry/nextjs';

import type { Poll } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';
import { isValidPollStatus } from '@/lib/isValidPollStatus';

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
    const polls = await prisma.poll.findMany({});
    const convertedPolls = convertBigIntsToStrings(polls);

    // Filter items to include only those with a valid poll status
    const filteredPolls = convertedPolls.filter(isValidPollStatus);

    return res.status(200).json(filteredPolls);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
