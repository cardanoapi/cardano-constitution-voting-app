// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import type { User } from '@/types';
import { representativesDto } from '@/data/representativesDto';

type Data = User[];

/**
 * Gets all delegates and alternates in the DB
 * @returns status - 200 if successful, 500 if representative fetching failed from an internal error
 * @returns User[] - An array of Representatives, empty array if error encountered
 */
export default async function getRepresentatives(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json([]);
    }

    const users = await representativesDto();

    return res.status(200).json(users);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
