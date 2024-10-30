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
