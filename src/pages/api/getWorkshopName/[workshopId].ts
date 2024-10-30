// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { User } from '@/types';
import { parseJsonData } from '@/lib/parseJsonData';

const prisma = new PrismaClient();

type Data = {
  name: string;
  message: string;
};

/**
 * Gets the name of a workshop by id
 * @param workshopId - The ID of the workshop
 * @returns status - 200 if successful, 400 if workshopId is invalid, 404 if workshop is not found, 500 if workshop fetching failed from an internal error
 * @returns message - An error message if getting the workshop name failed
 * @returns name - The workshop name, empty string if error encountered
 */
export default async function getWorkshopName(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ name: '', message: 'Method not allowed' });
    }
    const workshopId = req.query.workshopId;
    if (typeof workshopId !== 'string') {
      return res
        .status(400)
        .json({ name: '', message: 'Invalid query workshopId' });
    }
    const workshop = await prisma.workshop.findFirst({
      where: {
        id: BigInt(workshopId),
      },
    });
    if (!workshop) {
      return res.status(404).json({ name: '', message: 'Workshop not found' });
    }
    const workshopJson = parseJsonData(workshop);
    const workshopName = workshopJson.name;
    return res
      .status(200)
      .json({ name: workshopName, message: 'Found workshop' });
  } catch (error) {
    return res
      .status(500)
      .json({ name: '', message: 'Error fetching workshop name' });
  }
}
