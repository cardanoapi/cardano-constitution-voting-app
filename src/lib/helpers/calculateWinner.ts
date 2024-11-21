import { getActiveVoterCount } from '@/lib/helpers/getActiveVoterCount';

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
