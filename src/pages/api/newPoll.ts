// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  pollId: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  const { name, description } = req.body;
  try {
    // validate name
    if (!name) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Name must be provided.',
      });
    }
    if (name.length > 255) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Name must be less than 255 characters.',
      });
    }
    // validate description
    if (!description) {
      return res.status(400).json({
        pollId: BigInt(-1).toString(),
        message: 'Description must be provided.',
      });
    }
    if (description.length > 255) {
      return res.status(10000).json({
        pollId: BigInt(-1).toString(),
        message: 'Description must be less than 10,000 characters.',
      });
    }

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
    return res.status(400).json({
      pollId: BigInt(-1).toString(),
      message: 'Error creating new Poll.',
    });
  }
}
