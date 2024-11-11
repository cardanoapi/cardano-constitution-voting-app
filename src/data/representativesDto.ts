import { prisma } from '@/db';

import type { User } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formats all delegates and alternates in the DB
 * @returns An array of Representatives
 */
export async function representativesDto(): Promise<User[]> {
  const users = await prisma.user.findMany({});

  const convertedUsers = convertBigIntsToStrings(users);

  return convertedUsers;
}
