// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { Workshop } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

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
    const workshopJson = await prisma.workshop.findMany({});
    const workshops = parseJsonData(workshopJson);
    return res.status(200).json(workshops);
  } catch (error) {
    // TODO: Add sentry instead of console.error
    console.error('error', error);
    return res.status(500).json([]);
  }
}
