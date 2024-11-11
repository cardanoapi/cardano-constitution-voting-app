// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import type { Poll } from '@/types';
import { pollsDto } from '@/data/pollsDto';

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

    const polls = await pollsDto();

    return res.status(200).json(polls);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
