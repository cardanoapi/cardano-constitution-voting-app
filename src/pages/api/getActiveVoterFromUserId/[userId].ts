// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

type Data = { activeVoter: string; message: string };

/**
 * Gets the id of the active voter for a workshop by the user id of a representative from that workshop
 * @param userId - The ID of a representative
 * @returns status - 200 if successful, 400 if userId is invalid, 404 if active voter is not found, 500 if active voter fetching failed from an internal error
 * @returns message - An error message if getting the active voter failed from an internal error
 * @returns activeVoter - The ID of the active voter for the workshop
 */
export default async function getActiveVoterFromUserId(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({
      message: 'Method not allowed.',
      activeVoter: '',
    });
    }
    const userId = req.query.userId;
    if (typeof userId !== 'string') {
      return res.status(400).json({
        activeVoter: '',
        message: 'Invalid userId',
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: BigInt(userId),
      },
      select: {
        workshop_user_workshop_idToworkshop: {
          select: {
            active_voter_id: true,
          },
        },
      },
    });
    if (user === null) {
      return res.status(404).json({
        activeVoter: '',
        message: 'Active voter status not found',
      });
    }
    const pollJson = {
      activeVoter:
        user.workshop_user_workshop_idToworkshop.active_voter_id?.toString() ||
        '',
      message: 'Active voter status found',
    };
    return res.status(200).json(pollJson);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      message: 'Error getting Active Voter Id.',
      activeVoter: '',
    });
  }
}
