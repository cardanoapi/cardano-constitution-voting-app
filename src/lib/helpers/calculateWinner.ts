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
}): Promise<string> {
  const yesCount = votes.yes.length;
  const abstainCount = votes.abstain.length;

  const data = await getActiveVoterCount();
  const activeVoterCount = data.voters;

  if (activeVoterCount === -1) {
    return '';
  }

  const threshold = (activeVoterCount - abstainCount) / 2; // using 50% according to Intersect

  if (yesCount > threshold) {
    return 'yes';
  } else {
    return 'no';
  }
}
