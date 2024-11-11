import { prisma } from '@/db';

import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formats the results of a concluded poll
 * @param pollId - The ID of the poll to get results for
 * @returns Results of the poll
 */
export async function pollResultsDto(pollId: string): Promise<{
  [key: string]: {
    name: string;
    id: string;
  }[];
}> {
  const votes = await prisma.poll_vote.findMany({
    where: {
      poll_id: BigInt(pollId),
      poll: {
        status: 'concluded',
      },
    },
    select: {
      user_id: true,
      vote: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const convertedVotes = convertBigIntsToStrings(votes);

  const formattedVotes = convertedVotes.reduce(
    (
      acc: {
        [key: string]: {
          name: string;
          id: string;
        }[];
      },
      {
        user,
        user_id,
        vote,
      }: { user: { name: string }; user_id: string; vote: string },
    ) => {
      // Initialize the array for each vote choice if it doesn't exist
      if (!acc[vote]) {
        acc[vote] = [];
      }

      // Add the user object to the appropriate vote choice array
      acc[vote].push({
        name: user.name,
        id: user_id,
      });

      return acc;
    },
    { yes: [], no: [], abstain: [] },
  );

  return formattedVotes;
}
