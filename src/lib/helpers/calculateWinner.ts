export function calculateWinner(votes: {
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
}): string {
  const yesCount = votes.yes.length;
  const abstainCount = votes.abstain.length;

  const workshopCount = 62;
  const threshold = (workshopCount - abstainCount) / 2;
  if (yesCount > threshold) {
    return 'yes';
  } else {
    return 'no';
  }
  return '';
}
