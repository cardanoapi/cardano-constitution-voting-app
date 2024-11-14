import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { getTxMetadata } from '@/lib/helpers/getTxMetadata';
import { postVotesOnChain } from '@/lib/postVotesOnChain';

interface Props {
  pollId: string | string[] | undefined;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

/**
 * A button for workshop coordinators to post poll votes on chain
 * @param pollId - The pollId of the poll to end voting for
 * @param isSubmitting - Whether the button is in a submitting state
 * @param setIsSubmitting - Function to set the submitting state
 * @returns Put votes on-chain Button
 */
export function PutVotesOnChainButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;

  const session = useSession();

  async function handleClick(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }
    setIsSubmitting(true);
    // Put votes on-chain
    const response = await getTxMetadata(pollId);
    if (response.metadata) {
      let txHash = null;
      // For loop required as they metadata may be broken up into multiple transactions
      for (const metadata of Object.values(response.metadata)) {
        // Post votes on chain
        txHash = await postVotesOnChain(metadata);
      }
      if (txHash) {
        toast.success('Votes posted on-chain!');
      } else {
        toast.error('Error posting votes on-chain. Please try again.');
      }
    } else {
      toast.error('Error getting transaction metadata. Please try again.');
    }
    setIsSubmitting(false);
  }

  if (session.data?.user.isCoordinator) {
    return (
      <Button
        onClick={handleClick}
        variant="contained"
        disabled={isSubmitting}
        data-testid="put-votes-onchain-button"
      >
        Upload votes on-chain
      </Button>
    );
  } else {
    return <></>;
  }
}
