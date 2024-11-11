import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import * as Sentry from '@sentry/nextjs';

import { secureRandom } from '@/lib/secureRandom';

/**
 * Generates a unique challenge to include with signature for Cardano
 * @param req - NextApiRequest
 * @param res - NextApiResponse
 * @returns The challenge
 */
export default async function newChallenge(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void | NextApiResponse> {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res
        .status(405)
        .json({ challenge: null, message: 'Method not allowed' });
    }

    const challenge = secureRandom(32); // 32 random bytes as hex string
    const expires = Date.now() + 1000 * 60 * 1; // expires in 1 minutes
    await prisma.challenge.create({
      data: {
        id: challenge,
        expire_time: expires,
      },
    });
    return res.status(200).json({
      challenge: challenge,
      message: 'Challenge created successfully',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res
      .status(500)
      .json({ challenge: null, message: 'Failed to generate challenge' });
  }
}
