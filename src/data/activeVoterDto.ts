import { prisma } from '@/db';

import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets the active voter for a workshop of the signed-in user
 * @param userId - The ID of the current user
 * @returns Formatted active voter ID for a workshop
 */
export async function activeVoterDto(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    include: {
      workshop_user_workshop_idToworkshop: true,
    },
  });

  if (!user) {
    return null;
  }

  const formattedUser = convertBigIntsToStrings(user);

  return formattedUser.workshop_user_workshop_idToworkshop.active_voter_id;
}
