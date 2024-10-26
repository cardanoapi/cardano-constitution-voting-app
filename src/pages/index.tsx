import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { Poll } from '@/types';
import { ConnectWalletButton } from '@/components/buttons/connectWalletButton';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
import { WidgetContainer } from '@/components/widgetContainer';

export default function Home(): JSX.Element {
  const [polls, setPolls] = useState<Poll[]>([]);

  const theme = useTheme();

  useEffect(() => {
    fetch('/api/getPolls', { headers: { 'X-Custom-Header': 'intersect' } })
      .then((res) => res.json())
      .then((data) => setPolls(data));
  }, []);

  const pollList = useMemo(() => {
    if (polls.length > 0) {
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography textAlign="center">
            Anyone can browse the polls and view results without connecting a
            wallet:
          </Typography>
          <Grid container spacing={2}>
            {polls.map((poll) => {
              return (
                <Grid
                  key={poll.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                  alignSelf="stretch"
                >
                  <Link
                    href={`/polls/${poll.id}`}
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.text.primary,
                      height: '100%',
                    }}
                  >
                    <WidgetContainer>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box
                          display="flex"
                          flexDirection={{ xs: 'column', xl: 'row' }}
                          alignItems="center"
                          gap={1}
                        >
                          <Typography variant="h5" fontWeight="bold">
                            {poll.name}
                          </Typography>
                          <PollStatusChip status={poll.status} />
                        </Box>
                        <Typography variant="body1">
                          {poll.description}
                        </Typography>
                        <Box
                          display="flex"
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={2}
                        >
                          <Typography>View</Typography>
                          <LaunchRounded fontSize="small" />
                        </Box>
                      </Box>
                    </WidgetContainer>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      );
    } else {
      return <>No polls found</>;
    }
  }, [polls]);

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
        <Box
          display="flex"
          flexDirection="column"
          gap={4}
          alignItems="center"
          sx={{
            mt: {
              xs: 4,
              sm: 8,
              md: 12,
              lg: 16,
              xl: 24,
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography variant="h3" fontWeight="bold" textAlign="center">
              Welcome to the Constitutional Convention Voting Tool
            </Typography>
            <Box display="flex" flexDirection="column">
              <Typography variant="h5" fontWeight="500" textAlign="center">
                Are you a delegate?
              </Typography>
              <Typography variant="h6" textAlign="center">
                Connect a wallet to cast your vote:
              </Typography>
              {/* <ConnectWalletButton /> */}
            </Box>
          </Box>
          {pollList}
        </Box>
      </main>
    </>
  );
}
