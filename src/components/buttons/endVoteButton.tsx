import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

import { paths } from '@/paths';
import { endVoting } from '@/lib/helpers/endVoting';
import { newPoll } from '@/lib/helpers/newPoll';
import { startVoting } from '@/lib/helpers/startVoting';

interface Props {
  pollId: string;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A button for workshop coordinators to end voting for a poll
 * @returns End Voting Button
 */
export function EndVoteButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;
  const router = useRouter();
  // call new poll api with this name & description
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
