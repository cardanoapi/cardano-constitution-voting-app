import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { HowToVoteRounded } from '@mui/icons-material';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import toast from 'react-hot-toast';

import { PollVote, User } from '@/types';
import { getUser } from '@/lib/helpers/getUser';
import { getUserVotes } from '@/lib/helpers/getUserVotes';
import { getWorkshopName } from '@/lib/helpers/getWorkshopName';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { RepresentativesTable } from '@/components/representatives/representativesTable';
import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

export default function Representative(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [workshopName, setWorkshopName] = useState('');
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingWorkshop, setLoadingWorkshop] = useState(false);
  const [loadingVotes, setLoadingVotes] = useState(true);

  const router = useRouter();
  const { userId } = router.query;
  const theme = useTheme();

  useEffect(() => {
    // looks up a user & their vote history in the DB from their userId
    async function fetchUserData(): Promise<void> {
      // get user data
      setLoadingUser(true);
      const data = await getUser(userId);
      if (data.user) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
      setLoadingUser(false);

      // get vote data
      setLoadingVotes(true);
      const votes = await getUserVotes(userId);
      if (votes) {
        setVotes(votes.votes);
      }
      setLoadingVotes(false);
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // get the name of the workshop they attended
  useEffect(() => {
    async function fetchWorkshop(): Promise<void> {
      if (user) {
        // get user data
        setLoadingWorkshop(true);
        const workshopName = await getWorkshopName(user.workshop_id.toString());
        if (workshopName.name) {
          setWorkshopName(workshopName.name);
        } else {
          toast.error(workshopName.message);
        }
        setLoadingWorkshop(false);
      }
    }
    fetchWorkshop();
  }, [user]);

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Consitution Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗳️</text></svg>"
        />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={9}>
          <Grid container>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              {user ? (
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    data-testid="user-name"
                  >
                    {user.name}
                  </Typography>
                  {user.is_delegate && (
                    <Typography
                      variant="h4"
                      fontWeight="600"
                      data-testid="user-delegate"
                    >
                      DELEGATE
                    </Typography>
                  )}
                  {user.is_alternate && (
                    <Typography
                      variant="h4"
                      fontWeight="600"
                      data-testid="user-alternate"
                    >
                      ALTERNATE
                    </Typography>
                  )}
                  {votes ? (
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap={1}
                      alignItems="center"
                      color={theme.palette.text.primary}
                    >
                      <HowToVoteRounded />
                      <Typography
                        variant="h5"
                        fontWeight="500"
                        data-testid="user-vote-count"
                      >
                        {votes.length} vote{votes.length === 1 ? '' : 's'}
                      </Typography>
                    </Box>
                  ) : (
                    loadingVotes && (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                      </Box>
                    )
                  )}
                  {workshopName ? (
                    <Typography
                      variant="h5"
                      fontWeight="500"
                      data-testid="workshop-name"
                    >
                      {workshopName}
                    </Typography>
                  ) : (
                    loadingWorkshop && (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                      </Box>
                    )
                  )}
                </Box>
              ) : (
                loadingUser && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )
              )}
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <VotingHistoryTable userId={userId} />
            </Grid>
          </Grid>

          <PollCarrousel currentPollId={undefined} />
          <RepresentativesTable />
        </Box>
      </main>
    </>
  );
}
