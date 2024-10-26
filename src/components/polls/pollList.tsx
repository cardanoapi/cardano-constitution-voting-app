import { useEffect, useState } from 'react';
import Link from 'next/link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

import { Poll } from '@/types';
import { getPolls } from '@/lib/getPolls';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
import { WidgetContainer } from '@/components/widgetContainer';

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
  const theme = useTheme();

  if (loadingPolls) return <></>;
  if (polls.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {session.status !== 'authenticated' && (
          <Typography textAlign="center">
            Anyone can browse the polls and view results without connecting a
            wallet:
          </Typography>
        )}
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
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      height="100%"
                    >
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
                      <Box flexGrow={1} />
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
    return (
      <Typography variant="h4" textAlign="center">
        No polls yet.
      </Typography>
    );
  }
}
