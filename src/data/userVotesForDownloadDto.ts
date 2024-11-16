import { pollPhases } from '@/constants/pollPhases';
import { prisma } from '@/db';

import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formates all of a single user's votes for CSV download
 * @param userId - The ID of the user
 * @returns User's votes
 */
export async function userVotesForDownloadDto(userId: string): Promise<
  {
    poll: {
      name: string;
    };
    poll_transaction: {
      transaction_id: string;
    } | null;
    poll_id: string;
    user_id: string;
    vote: string;
    signature: string;
    hashed_message: string;
    poll_transaction_id: string | null;
  }[]
> {
  const votes = await prisma.poll_vote.findMany({
    where: {
      user_id: BigInt(userId),
      poll: {
        status: pollPhases.concluded,
        is_archived: false,
      },
    },
    include: {
      poll: {
        select: {
          name: true,
        },
      },
      poll_transaction: {
        select: {
          transaction_id: true,
        },
      },
    },
  });

  const convertedVotes = convertBigIntsToStrings(votes);

  return convertedVotes;
}
