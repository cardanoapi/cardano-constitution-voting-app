import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { awaitTxConfirm } from '@/lib/awaitTxConfirm';
import { dismissToast } from '@/lib/dismissToast';
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
  setIsTxUploading: (value: boolean) => void;
}

/**
 * A button for workshop coordinators to post poll votes on chain
 * @param pollId - The pollId of the poll to end voting for
 * @param isSubmitting - Whether the button is in a submitting state
 * @param setIsSubmitting - Function to set the submitting state
 * @param setIsTxUploading - Function to set the transaction submitting state
 * @returns Put votes on-chain Button
 */
export function PutVotesOnChainButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting, setIsTxUploading } = props;

  const session = useSession();

  async function handleClick(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }

    setIsSubmitting(true);
    let voteTxsUploaded = false;

    // Put votes on-chain
    const response = await getVotesTxMetadata(pollId);
    if (response.metadata) {
      // For loop required as the metadata may be broken up into multiple transactions
      for (let i = 0; i < Object.keys(response.metadata).length; i++) {
        const metadata = response.metadata[i];
        // Post votes on chain
        const txResult = await postVotesOnChain(metadata.metadata);
        setIsTxUploading(true);
        if (txResult) {
          // Add txHash to poll_transaction records
          const addTxResponse = await addTxToPollTransactions(
            pollId,
            txResult.submitTxId,
          );
          if (addTxResponse.pollTransactionId === '-1') {
            // If there is an error, stop the loop and display an error message. This will allow
            // the CO to manually upload the TX ID to the DB before moving onto the next TXs.
            dismissToast(`Error saving the TX ${txResult.submitTxId} to the database. Please retrieve the TX ID
              and metadata from your wallet transactions and manually upload to the
              poll transactions in the DB.`);
            setIsTxUploading(false);
            break;
          }
          // Add txHash to poll votes
          const addTxToVotesResponse = await addTxToPollVotes(
            metadata.userIds,
            pollId,
            addTxResponse.pollTransactionId,
          );
          if (!addTxToVotesResponse.succeeded) {
            // If there is an error, stop the loop and display an error message. This will allow
            // the CO to manually upload the TX ID to the DB before moving onto the next TXs.
            dismissToast(`Error saving the TX ${txResult.submitTxId} to the database. Please retrieve the TX ID
            and metadata from your wallet transactions and manually upload to the
            poll votes in the DB.`);
            setIsTxUploading(false);
            break;
          }
          // Only show the TX uploading on-chain message if the TX ID was
          // successfully saved to both the poll_transaction and poll_vote tables.
          if (
            addTxResponse.pollTransactionId !== '-1' &&
            addTxToVotesResponse.succeeded
          ) {
            await awaitTxConfirm(txResult.submitTxId).then(() =>
              setIsTxUploading(false),
            );
          }
          // If this is the last metadata object, set voteTxsUploaded to true
          if (i === Object.keys(response.metadata).length - 1) {
            voteTxsUploaded = true;
          }
        } else {
          // If there is an error, stop the loop and display an error message. This will allow
          // the CO to retry signing the TX.
          toast.error(
            'Error posting this TX on-chain. Please try signing this TX again. If the issue persists, refresh the app and re-click the upload votes on-chain button.',
          );
          setIsTxUploading(false);
          break;
        }
      }
    } else if (
      response.message !== 'All votes have already been uploaded on-chain'
    ) {
      toast.error(response.message);
      setIsTxUploading(false);
    } else {
      // If there is no metadata because all votes are already on-chain,
      // do not display an error message. Just move onto the summary TX.
      voteTxsUploaded = true;
    }

    // We only want to move onto the summary TX signing if all votes have been uploaded on-chain.
    if (voteTxsUploaded) {
      // Put summary TX on-chain
      const summaryTxResponse = await getSummaryTxMetadata(pollId);
      if (summaryTxResponse.metadata) {
        const txResult = await postVotesOnChain(summaryTxResponse.metadata);
        setIsTxUploading(true);
        if (txResult) {
          // Add txHash to poll
          const addTxResponse = await addTxToPoll(pollId, txResult.submitTxId);
          if (!addTxResponse.success) {
            // Note that if saving the TX ID to the DB fails, the user will have to manually upload the TX ID to the DB.
            // The upload votes on-chain button will also reappear. However, the CO does not want to re-click this button
            // as the TX is already on-chain. Once the TX ID is manually added to the DB, the button will disappear.
            dismissToast(`Error saving the TX ${txResult.submitTxId} to the database. Please retrieve the TX ID
              and metadata from your wallet transactions and manually upload to the
              poll in the DB.`);
            setIsTxUploading(false);
          } else {
            // Only show the TX uploading on-chain message if the TX ID was
            // successfully saved to both the poll_transaction and poll_vote tables.
            await awaitTxConfirm(txResult.submitTxId).then(() =>
              setIsTxUploading(false),
            );
          }
        } else {
          // If there is an error, display an error message. This will allow
          // the CO to retry signing the TX.
          toast.error(
            'Error posting this TX on-chain. Please try signing this TX again. If the issue persists, refresh the app and re-click the upload votes on-chain button.',
          );
          setIsTxUploading(false);
        }
      } else {
        // If there is no metadata display an error message.
        // The user will have to try signing the TX again.
        toast.error(response.message);
        setIsTxUploading(false);
      }
    }

    setIsSubmitting(false);
  }

  if (session.data?.user.isCoordinator) {
    return (
      <>
        <Button
          onClick={handleClick}
          variant="contained"
          disabled={isSubmitting}
          data-testid="put-votes-onchain-button"
        >
          Upload votes on-chain
        </Button>
      </>
    );
  } else {
    return <></>;
  }
}
