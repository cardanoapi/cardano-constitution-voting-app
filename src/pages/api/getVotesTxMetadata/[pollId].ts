// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import type { Metadata } from '@/types';
import { pollDto } from '@/data/pollDto';
import { pollVotesDto } from '@/data/pollVotesDto';
import { checkIfCO } from '@/lib/checkIfCO';
import { getBytesOfArray } from '@/lib/getBytesOfArray';
import { splitStringByBytes } from '@/lib/splitStringByBytes';

type Data = { metadata: Metadata | null; message: string };

/**
 * Constructs the metadata for the CO's transactions to upload poll votes on-chain
 * @param pollId - The ID of the poll
 * @returns status - 200 if successful, 500 if failed from an internal error
 * @returns message - A message indicating the status of the request
 * @returns metadata - The metadata for the TXs
 */
export default async function getVotesTxMetadata(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res
        .status(405)
        .json({ metadata: null, message: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        metadata: null,
        message: 'User is not logged in',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        metadata: null,
        message: 'User is not a convention organizer',
      });
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json({
        metadata: null,
        message: 'Invalid pollId',
      });
    }

    const poll = await pollDto(pollId);
    if (poll?.status !== pollPhases.concluded) {
      return res.status(400).json({
        metadata: null,
        message: 'Poll is not concluded',
      });
    }

    const pollVotes = await pollVotesDto(pollId);

    // Filter out votes that already have a transaction ID. This is to prevent votes from being uploaded on-chain twice.
    // This could happen if the CO has to sign multiple TXs, the first TX succeeds, but the second TX fails.
    const filteredPollVotes = pollVotes.filter(
      (vote) => vote.poll_transaction_id === null,
    );

    if (filteredPollVotes.length === 0) {
      return res.status(400).json({
        metadata: null,
        message: 'All votes have already been uploaded on-chain',
      });
    }

    const metadata: Metadata = {};

    let i = 0;
    let temporaryMetadataArray: { [key: string]: string[] }[] = []; // Temporary array to store metadata for a single transaction
    let temporaryUserArray: string[] = []; // Temporary array to store user IDs that are included in a single transaction
    for (const vote of filteredPollVotes) {
      // First, check how large the bytes of the temporary array is
      const bytes = getBytesOfArray(temporaryMetadataArray);
      // Limit is set to 10 KB right now. Cardano TX limit is 16KB. This is to be safe. If the limit is reached, create a new entry in the metadata object.
      // Not entirely sure what the limit should be. However, I would rather the CO have to sign multiple transactions than have the TX building fail.
      if (bytes > 10000) {
        metadata[i] = {
          metadata: temporaryMetadataArray,
          userIds: temporaryUserArray,
        };
        i++;
        temporaryMetadataArray = [];
        temporaryUserArray = [];
      }
      // A given value in the metadata object can only be 64 bytes. If it is larger, it must be split into an array of strings.
      const value = splitStringByBytes(
        `${vote.hashed_message}, ${vote.signature}`,
        64,
      );
      // The key is the user's name. Their name will get cut off at 64 bytes to ensure the value is not too large.
      temporaryMetadataArray.push({ [vote.user.name.slice(0, 64)]: value });
      temporaryUserArray.push(vote.user.id);
    }

    // If there are any remaining entries in the temporary array, add them to the metadata object
    if (temporaryMetadataArray.length > 0) {
      metadata[i] = {
        metadata: temporaryMetadataArray,
        userIds: temporaryUserArray,
      };
    }

    return res
      .status(200)
      .json({ metadata: metadata, message: 'Metadata constructed' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      metadata: null,
      message: 'Error constructing metadata.',
    });
  }
}
