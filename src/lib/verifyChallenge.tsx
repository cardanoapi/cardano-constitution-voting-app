import { prisma } from '@/db';

/**
 * Verifies a challenge from the FE for Cardano
 * @param passedChallenge - The challenge from the FE to verify
 * @returns True if the challenge is verified, false otherwise
 */
export async function verifyChallenge(
  passedChallenge: string,
): Promise<boolean> {
  const challenge = await prisma.challenge.findFirst({
    where: {
      id: passedChallenge,
    },
  });

  if (!challenge) return false;

  await prisma.challenge.delete({
    where: {
      id: challenge.id,
    },
  });
  const isValid = Number(challenge.expire_time) > Date.now(); // check if challenge is still valid

  return isValid;
}
