import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

import type { Poll } from '@/types';
import { getPolls } from '@/lib/getPolls';
import { PollCard } from '@/components/polls/pollCard';

/**
 * A grid of all polls with their status and a link to view the poll, to be shown on the homepage
 * @returns Poll List
 */
export function PollList(): JSX.Element {
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    async function fetchPolls(): Promise<void> {
      setLoadingPolls(true);
      const polls = await getPolls();
      setPolls(polls);
      setLoadingPolls(false);
    }
    fetchPolls();
  }, []);

  const session = useSession();

  const pollCards = useMemo(() => {
    return polls.map((poll) => {
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
          <PollCard poll={poll} />
        </Grid>
      );
    });
  }, [polls]);

  if (loadingPolls) {
    return <></>;
  } else if (polls.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {session.status !== 'authenticated' && (
          <Typography textAlign="center">
            Anyone can browse the polls and view results without connecting a
            wallet:
          </Typography>
        )}
        <Grid container spacing={2}>
          {pollCards}
        </Grid>
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No polls yet.
      </Typography>
    );
  }
}
