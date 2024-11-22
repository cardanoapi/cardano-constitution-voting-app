import { getActiveVoterCount } from '@/lib/helpers/getActiveVoterCount';

/**
 * Uses the votes object to calculate the winner of the vote per Intersect's formula
 * @param votes - The votes object containing the yes, no, and abstain arrays
 * @returns Yes or no depending if the poll passed or not
 */
export async function calculateWinner(votes: {
  yes: {
    name: string;
    id: string;
  }[];
  no: {
    name: string;
    id: string;
  }[];
  abstain: {
    name: string;
    id: string;
  }[];
}): Promise<{
  percentage: number;
  activeVoterCount: number;
}> {
  const yesCount = votes.yes.length;
  const abstainCount = votes.abstain.length;

  const data = await getActiveVoterCount();
  const activeVoterCount = data.voters;

  if (activeVoterCount === -1) {
    return {
      percentage: -1,
      activeVoterCount: -1,
    };
  }

  const percentage =
    Math.round((yesCount / (activeVoterCount - abstainCount)) * 100) || 0;
  return {
    percentage: percentage,
    activeVoterCount: activeVoterCount,
  };
}
