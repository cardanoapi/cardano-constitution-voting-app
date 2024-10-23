// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  pollId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const { name, description } = req.body;
  try {
    const createdPoll = await prisma.poll.create({
      data: {
        name: name,
        description: description,
        status: 'pending',
      },
    });
    return res.status(200).json({ pollId: createdPoll?.id.toString() });
  } catch (error) {
    console.error('error', error);
    return res.status(400).json({ pollId: BigInt(-1).toString() });
  }
}
