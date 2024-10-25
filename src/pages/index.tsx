import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Typography, useTheme } from '@mui/material';

import { Poll } from '@/types';
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
        <Box display="flex" flexDirection="column" gap={3}>
          {polls.map((poll) => {
            return (
              <Link
                href={`/polls/${poll.id}`}
                style={{
                  textDecoration: 'none',
                  color: theme.palette.text.primary,
                }}
              >
                <WidgetContainer>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: 'column', md: 'row' }}
                      alignItems="center"
                      gap={1}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {poll.name}
                      </Typography>
                      <PollStatusChip status={poll.status} />
                    </Box>
                    <Typography variant="body1">{poll.description}</Typography>
                  </Box>
                </WidgetContainer>
              </Link>
            );
          })}
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
      <main>{pollList}</main>
    </>
  );
}
