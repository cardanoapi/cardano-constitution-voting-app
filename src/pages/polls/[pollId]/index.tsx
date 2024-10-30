/* eslint-disable indent */
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { pollPhases } from '@/constants/pollPhases';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';

import { Poll } from '@/types';
import { paths } from '@/paths';
import { getPoll } from '@/lib/getPoll';
import { BeginVoteButton } from '@/components/buttons/beginVoteButton';
import { EndVoteButton } from '@/components/buttons/endVoteButton';
import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
import { PollVoteCount } from '@/components/polls/pollVoteCount';

export default function ViewPoll(): JSX.Element {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPoll, setLoadingPoll] = useState(true);

  const theme = useTheme();
  const router = useRouter();
  const { pollId } = router.query;

  useEffect(() => {
    async function fetchPoll(): Promise<void> {
      console.log('pollId', pollId);
      if (typeof pollId !== 'string') {
        return;
      }
      setLoadingPoll(true);
      const data = await getPoll(pollId);
      if (data.poll) {
        setPoll(data.poll);
      } else {
        toast.error(data.message);
      }
      setLoadingPoll(false);
    }
    fetchPoll();
  }, [pollId]);

  const updateIsSubmitting = useCallback((value: boolean) => {
    setIsSubmitting(value);
  }, []);

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Consitution Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            display="flex"
            flexDirection="row"
            gap={3}
            justifyContent={{ xs: 'space-between', lg: 'flex-start' }}
            alignItems="center"
          >
            <Typography variant="h1" fontWeight="bold">
              {poll ? poll.name : 'View Poll'}
            </Typography>
            {poll && <PollStatusChip status={poll.status} />}
          </Box>
          <PollVoteCount pollId={poll?.id?.toString() || ''} />
          <Grid container>
            {poll ? (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography variant="h6">{poll.description}</Typography>
                </Box>
              </Grid>
            ) : (
              !loadingPoll && (
                <Typography variant="h4">Poll not found</Typography>
              )
            )}
            {poll && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={3}
                  alignItems="center"
                >
                  {/* Coordinator Buttons */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    alignItems="center"
                  >
                    <Typography>Manage Poll:</Typography>
                    {poll.status === pollPhases.pending &&
                      typeof pollId === 'string' && (
                        <BeginVoteButton
                          pollId={pollId}
                          isSubmitting={isSubmitting}
                          setIsSubmitting={updateIsSubmitting}
                        />
                      )}
                    {poll.status === pollPhases.voting &&
                      typeof pollId === 'string' && (
                        <EndVoteButton
                          pollId={pollId}
                          isSubmitting={isSubmitting}
                          setIsSubmitting={updateIsSubmitting}
                        />
                      )}
                  </Box>
                  {/* Delegate Voting Buttons */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    alignItems="center"
                  >
                    <Typography>Cast your vote:</Typography>
                    <VoteOnPollButtons
                      poll={poll}
                      disabled={isSubmitting}
                      setDisabled={updateIsSubmitting}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            alignItems="center"
          >
            {/* Browse Other Polls Carrousel */}
            <PollCarrousel />
            <Box display="flex" flexDirection="row" gap={3}>
              {/* Link all polls */}
              <Link
                href={paths.home}
                style={{
                  color: theme.palette.text.primary,
                }}
              >
                View all polls
              </Link>
              {/* Link to browse representatives */}
              <Link
                href={paths.home}
                style={{
                  color: theme.palette.text.primary,
                }}
              >
                Browse representatives
              </Link>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
}
