// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import { workshopsDto } from '@/data/workshopsDto';

type Data = number;

export default async function getActiveVoterCount(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json(-1);
    }

    const workshops = await workshopsDto();

    const activeWorkshops = workshops.filter(
      (workshop) => workshop.active_voter_id,
    );
    const workshopCount = activeWorkshops.length;

    return res.status(200).json(workshopCount);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json(-1);
  }
}
