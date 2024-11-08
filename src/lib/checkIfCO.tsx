import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Checks if a user is a convention organizer
 * @param req - NextApiRequest
 * @param res - NextApiResponse
 * @returns Boolean - True if user is a convention organizer, false otherwise
 */
export async function checkIfCO(
  req: NextApiRequest,
  res: NextApiResponse,
  stakeAddress: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      wallet_address: stakeAddress,
    },
  });
  if (!user || !user.is_convention_organizer) {
    return false;
  } else {
    return true;
  }
}
