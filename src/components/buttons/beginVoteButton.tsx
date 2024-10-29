import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

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
    const errorMessage = await startVoting(pollId);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success('Poll voting is open!');
    }
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
