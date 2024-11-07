import { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import Carousel from 'react-material-ui-carousel';

import type { Poll } from '@/types';
import { getPolls } from '@/lib/helpers/getPolls';
import { PollCard } from '@/components/polls/pollCard';

interface Props {
  currentPollId: string | string[] | undefined;
}

/**
 * A Carrousel of poll cards
 * @param currentPollId - The ID of the current poll
 * @returns Poll List
 */
export function PollCarrousel(props: Props): JSX.Element {
  const { currentPollId } = props;
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    async function fetchPolls(): Promise<void> {
      setLoadingPolls(true);
      let polls = await getPolls();
      // don't show the current poll
      if (typeof currentPollId === 'string') {
        polls = polls.filter((poll) => poll.id !== currentPollId);
      }

      // only show the last 4 polls in this view
      polls.reverse();
      polls.splice(4);
      setPolls(polls);
      setLoadingPolls(false);
    }
    fetchPolls();
  }, [currentPollId]);

  const session = useSession();

  const pollCards = useMemo(() => {
    return (
      <>
        {/* Small Screen, carousel on top of the page */}
        <Box
          display={{
            xs: 'flex',
            md: 'none',
          }}
          flexDirection="column"
          width="100%"
          data-testid="poll-carousel"
        >
          <Carousel autoPlay={false}>
            {polls.map((poll) => {
              return (
                <Box key={poll.id}>
                  <PollCard poll={poll} />
                </Box>
              );
            })}
          </Carousel>
        </Box>
        {/* Large Screen, show all cards in a grid */}
        <Box
          display={{
            xs: 'none',
            md: 'flex',
          }}
          flexDirection="column"
          width="100%"
        >
          <Grid container spacing={3}>
            {polls.map((poll) => {
              return (
                <Grid
                  size={{
                    xs: 6,
                    xl: 3,
                  }}
                  key={poll.id}
                >
                  <PollCard poll={poll} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </>
    );
  }, [polls]);

  if (loadingPolls) {
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );
  } else if (polls.length > 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        alignItems="center"
      >
        {session.status !== 'authenticated' && (
          <Typography textAlign="center" variant="h6" fontWeight="600">
            Browse other polls
          </Typography>
        )}
        {pollCards}
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
