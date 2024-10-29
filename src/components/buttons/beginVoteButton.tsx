import Button from '@mui/material/Button';

import { startVoting } from '@/lib/helpers/startVoting';

interface Props {
  pollId: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

/**
 * A button for workshop coordinators to open voting for a poll
 * @returns Begin Voting Button
 */
export function BeginVoteButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;

  async function handleBeginVote(): Promise<void> {
    setIsSubmitting(true);
    // Begin Vote
    await startVoting(pollId);
    setIsSubmitting(false);
  }

  return (
    <Button
      onClick={handleBeginVote}
      variant="contained"
      disabled={isSubmitting}
    >
      Begin Voting
    </Button>
  );
}
