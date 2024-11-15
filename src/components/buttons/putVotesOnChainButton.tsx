import type { TransactionSubmitResult } from '@claritydao/clarity-backend';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { addTxToPoll } from '@/lib/helpers/addTxToPoll';
import { addTxToPollVotes } from '@/lib/helpers/addTxToPollVotes';
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
      let txHash: false | TransactionSubmitResult = false;
      // For loop required as they metadata may be broken up into multiple transactions
      for (const metadata of Object.values(response.metadata)) {
        let success = false;
        // Keep trying until the transaction is successful
        while (!success) {
          // Post votes on chain
          txHash = await postVotesOnChain(metadata.metadata);
          if (txHash) {
            success = true;
            // Add txHash to poll
            const addTxResponse = await addTxToPoll(pollId, txHash.submitTxId);
            if (addTxResponse.pollTransactionId === '-1') {
              toast.error(addTxResponse.message);
              break;
            }
            // Add txHash to poll votes
            const addTxToVotesResponse = await addTxToPollVotes(
              metadata.userIds,
              pollId,
              addTxResponse.pollTransactionId,
            );
            if (!addTxToVotesResponse.succeeded) {
              toast.error(addTxToVotesResponse.message);
              break;
            }
          }
        }
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
