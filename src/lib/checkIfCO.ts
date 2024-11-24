import { prisma } from '@/db';

/**
 * Checks if a user is a convention organizer
 * @param req - NextApiRequest
 * @param res - NextApiResponse
 * @returns Boolean - True if user is a convention organizer, false otherwise
 */
export async function checkIfCO(stakeAddress: string): Promise<boolean> {
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
