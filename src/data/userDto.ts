import { prisma } from '@/db';

import type { User } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formats user data for a single user
 * @param userId - The ID of the user
 * @returns The user data, null if error encountered
 */
export async function userDto(userId: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      id: BigInt(userId),
    },
  });

  const convertedUser = convertBigIntsToStrings(user);

  return convertedUser;
}
