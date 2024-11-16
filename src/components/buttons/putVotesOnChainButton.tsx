import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { addTxToPoll } from '@/lib/helpers/addTxToPoll';
import { addTxToPollTransactions } from '@/lib/helpers/addTxToPollTransactions';
import { addTxToPollVotes } from '@/lib/helpers/addTxToPollVotes';
import { getSummaryTxMetadata } from '@/lib/helpers/getSummaryTxMetadata';
import { getVotesTxMetadata } from '@/lib/helpers/getVotesTxMetadata';
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
    const response = await getVotesTxMetadata(pollId);
    if (response.metadata) {
      // For loop required as they metadata may be broken up into multiple transactions
      for (const metadata of Object.values(response.metadata)) {
        let success = false;
        // Keep trying until the transaction is successful
        while (!success) {
          // Post votes on chain
          const txHash = await postVotesOnChain(metadata.metadata);
          if (txHash) {
            // TODO: Figure out how to handle errors in addTxToPollTransactions and addTxToPollVotes since the data is already on-chain
            success = true;
            // Add txHash to poll
            const addTxResponse = await addTxToPollTransactions(
              pollId,
              txHash.submitTxId,
            );
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
    } else if (
      response.message !== 'All votes have already been uploaded on-chain'
    ) {
      toast.error(response.message);
    }
    // Put summary TX on-chain
    let summaryTxSuccess = false;
    while (!summaryTxSuccess) {
      const response = await getSummaryTxMetadata(pollId);
      if (response.metadata) {
        const txHash = await postVotesOnChain(response.metadata);
        if (txHash) {
          // TODO: Figure out how to handle errors in addTxToPoll since the data is already on-chain
          summaryTxSuccess = true;
          // Add txHash to poll
          const addTxResponse = await addTxToPoll(pollId, txHash.submitTxId);
          if (!addTxResponse.success) {
            toast.error(addTxResponse.message);
            break;
          } else {
            toast.success('Votes successfully uploaded on-chain');
          }
        }
      } else {
        toast.error(response.message);
        break;
      }
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
