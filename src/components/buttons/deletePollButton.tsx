import { useRouter } from 'next/router';
import { DeleteRounded } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { paths } from '@/paths';
import { archivePoll } from '@/lib/helpers/archivePoll';

interface Props {
  pollId: string | string[] | undefined;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

/**
 * A button for workshop coordinators to open voting for a poll
 * @returns Begin Voting Button
 */
export function DeletePollButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;

  const session = useSession();
  const router = useRouter();

  async function handleDeleteVote(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }
    // Delete Poll
    setIsSubmitting(true);
    const result = await archivePoll(pollId);
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      toast.success('Poll deleted!');
      router.push(paths.home);
    }
    setIsSubmitting(false);
  }

  if (session.data?.user.isCoordinator) {
    return (
      <Button
        onClick={handleDeleteVote}
        variant="text"
        disabled={isSubmitting}
        data-testid="delete-poll-button"
        color="error"
      >
        <DeleteRounded />
      </Button>
    );
  } else {
    return <></>;
  }
}
