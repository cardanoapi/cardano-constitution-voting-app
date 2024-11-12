import { prisma } from '@/db';

/**
 * Gets and formats a workshop's name
 * @param workshopId - The ID of the workshop
 * @returns Workshop name if found, null if not found
 */
export async function workshopNameDto(
  workshopId: string,
): Promise<string | null> {
  const workshop = await prisma.workshop.findFirst({
    where: {
      id: BigInt(workshopId),
    },
  });

  if (workshop) {
    return workshop.name;
  } else {
    return null;
  }
}
