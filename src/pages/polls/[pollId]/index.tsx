import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { Poll } from '@/types';
import { paths } from '@/paths';
import { getPoll } from '@/lib/getPoll';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { PollStatusChip } from '@/components/polls/pollStatusChip';

export default function ViewPoll(): JSX.Element {
  const router = useRouter();
  const { pollId } = router.query;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loadingPoll, setLoadingPoll] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    async function fetchPoll(): Promise<void> {
      if (typeof pollId !== 'string') {
        return;
      }
      setLoadingPoll(true);
      const poll = await getPoll(pollId);
      setPoll(poll);
      setLoadingPoll(false);
    }
    fetchPoll();
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
                <Box display="flex" flexDirection="column" gap={3}>
                  <Box>
                    <Typography>Cast your vote:</Typography>
                  </Box>
                  {/* Advance Poll Button */}
                  {/* Voting Buttons */}
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
