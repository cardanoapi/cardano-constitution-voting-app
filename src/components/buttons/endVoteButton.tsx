import Button from '@mui/material/Button';

import { endVoting } from '@/lib/helpers/endVoting';

interface Props {
  pollId: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

/**
 * A button for workshop coordinators to end voting for a poll
 * @returns End Voting Button
 */
export function EndVoteButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;

  async function handleEndVote(): Promise<void> {
    setIsSubmitting(true);
    // End Vote
    await endVoting(pollId);
    setIsSubmitting(false);
  }

  return (
    <Button onClick={handleEndVote} variant="contained" disabled={isSubmitting}>
      End Voting
    </Button>
  );
}
