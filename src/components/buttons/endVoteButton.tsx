import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { endVoting } from '@/lib/helpers/endVoting';

interface Props {
  pollId: string | string[] | undefined;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

/**
 * A button for workshop coordinators to end voting for a poll
 * @returns End Voting Button
 */
export function EndVoteButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;

  const session = useSession();

  async function handleEndVote(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }
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

  if (session.data?.user.isCoordinator) {
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
  } else {
    return <></>;
  }
}
