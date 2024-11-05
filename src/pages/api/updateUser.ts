// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

const prisma = new PrismaClient();

type Data = {
  userId: string;
  message: string;
};
/**
 * Updates a user's name, email, and wallet address in the database
 * @returns UserId - The ID of the updated user
 * @returns Message - An error message if the user updating failed
 * @returns Status - 200 if successful, 400 if the user updating failed from user input, 500 if the user updating failed from an internal error
 */
export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    const { userId, name, email, wallet_address } = req.body;
    // TODO: Add session check to verify it is coordinator. Also additional security step of verifying coordinator's signature before creating poll?
    // TODO: Add data sanitization check. If fails sanitization return a message to the user.
    // validate name
    if (!name) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Name must be provided.',
      });
    }
    if (name.length > 100) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Name must be less than 100 characters.',
      });
    }
    // validate email
    if (!email) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Email must be provided.',
      });
    }
    if (email.length > 100) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Email must be less than 100 characters.',
      });
    }
    // validate wallet_address
    if (!wallet_address) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Wallet address must be provided.',
      });
    }
    if (wallet_address.length > 100) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Wallet address must be less than 100 characters.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: BigInt(userId),
      },
      data: {
        name: name,
        email: email,
        wallet_address: wallet_address,
      },
    });
    return res
      .status(200)
      .json({
        userId: updatedUser.id.toString(),
        message: 'User info updated',
      });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      userId: BigInt(-1).toString(),
      message: 'Error updating user.',
    });
  }
}
