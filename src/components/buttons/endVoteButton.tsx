import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

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
    const result = await endVoting(pollId);
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      toast.success('Voting ended!');
    }
    setIsSubmitting(false);
  }

  return (
    <Button
      onClick={handleEndVote}
      variant="contained"
      disabled={isSubmitting}
      data-testid="end-vote-button"
    >
      End Voting
    </Button>
  );
}
