import { prisma } from '@/db';

import type { Workshop } from '@/types';
import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formats all workshops in the DB
 * @returns An array of Workshops
 */
export async function workshopsDto(): Promise<Workshop[]> {
  const workshops = await prisma.workshop.findMany();

  const convertedWorkshops = convertBigIntsToStrings(workshops);

  return convertedWorkshops;
}
