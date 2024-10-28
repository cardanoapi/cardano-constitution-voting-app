import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

import { paths } from '@/paths';
import { newPoll } from '@/lib/helpers/newPoll';
import { startVoting } from '@/lib/helpers/startVoting';

interface Props {
  pollId: string;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A button for workshop coordinators to open voting for a poll
 * @returns Begin Voting Button
 */
export function BeginVoteButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;
  const router = useRouter();
  // call new poll api with this name & description
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
