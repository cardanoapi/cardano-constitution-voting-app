// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import type { Workshop } from '@/types';
import { workshopsDto } from '@/data/workshopsDto';

type Data = Workshop[];

/**
 * Gets all workshops in the DB
 * @returns status - 200 if successful, 500 if workshop fetching failed from an internal error
 * @returns Workshop[] - An array of Workshops, empty array if error encountered
 */
export default async function getWorkshops(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json([]);
    }

    const workshops = await workshopsDto();

    return res.status(200).json(workshops);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
