// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

type Data = {
  userId: string;
  message?: string;
};
/**
 * Updates which user is the active voter for a workshop
 * @returns UserId - The ID of the active voter
 * @returns Message - An error message if the user updating failed
 * @returns Status - 200 if successful, 400 if the user updating failed from user input, 500 if the user updating failed from an internal error
 */
export default async function updateActiveVoter(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    const { workshopId, activeVoterId } = req.body;
    // TODO: Add session check to verify it is coordinator. Also additional security step of verifying coordinator's signature before creating poll?
    // TODO: Add data sanitization check. If fails sanitization return a message to the user.
    // validate workshop id is provided
    if (!workshopId) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Active Voter id must be provided.',
      });
    }

    // validate new active voter id is provided
    if (!activeVoterId) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Active voter id must be provided.',
      });
    }

    // validate new active voter id is a delegate or alternate
    const workshop = await prisma.workshop.findFirst({
      where: {
        id: BigInt(workshopId),
      },
    });
    if (!workshop) {
      return res.status(404).json({
        userId: BigInt(-1).toString(),
        message: 'Workshop not found',
      });
    }

    const delegateId = workshop.delegate_id;
    const alternateId = workshop.alternate_id;
    if (
      activeVoterId !== delegateId?.toString() &&
      activeVoterId !== alternateId?.toString()
    ) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message:
          'Active voter id must be a delegate or alternate for this workshop.',
      });
    }

    const updatedWorkshop = await prisma.workshop.update({
      where: {
        id: BigInt(workshopId),
      },
      data: {
        active_voter_id: BigInt(activeVoterId),
      },
    });
    return res.status(200).json({
      userId: updatedWorkshop.active_voter_id?.toString() || activeVoterId,
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      userId: BigInt(-1).toString(),
      message: 'Error updating active voter.',
    });
  }
}
