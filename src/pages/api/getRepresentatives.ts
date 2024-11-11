// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import * as Sentry from '@sentry/nextjs';

import { User } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

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
    const usersJson = await prisma.user.findMany({});
    const users = parseJsonData(usersJson);
    return res.status(200).json(users);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
