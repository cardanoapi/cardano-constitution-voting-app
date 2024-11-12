import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { HowToVoteRounded } from '@mui/icons-material';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

import type { Poll, PollVote, User, Workshop } from '@/types';
import { pollsDto } from '@/data/pollsDto';
import { representativesDto } from '@/data/representativesDto';
import { userDto } from '@/data/userDto';
import { userVotesDto } from '@/data/userVotesDto';
import { workshopNameDto } from '@/data/workshopNameDto';
import { workshopsDto } from '@/data/workshopsDto';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { RepresentativesTable } from '@/components/representatives/representativesTable';
import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

interface Props {
  user: User | null;
  userVotes: PollVote[];
  representatives: User[];
  workshops: Workshop[];
  workshopName: string | null;
  polls: Poll[];
}

export default function Representative(props: Props): JSX.Element {
  const { user, userVotes, representatives, workshops, workshopName, polls } =
    props;

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
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
                      {userVotes.length} vote
                      {userVotes.length === 1 ? '' : 's'}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight="500"
                    data-testid="workshop-name"
                  >
                    {workshopName || 'Failed to retrieve workshop'}
                  </Typography>
                </Box>
              ) : (
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
              )}
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <VotingHistoryTable votes={userVotes} polls={polls} />
            </Grid>
          </Grid>

          <PollCarrousel currentPollId={undefined} polls={polls} />
          <RepresentativesTable
            representatives={representatives}
            workshops={workshops}
          />
        </Box>
      </main>
    </>
  );
}

type Params = {
  userId: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<Params>,
): Promise<{
  props: {
    user: User | null;
    userVotes: PollVote[];
    representatives: User[];
    workshops: Workshop[];
    workshopName: string | null;
    polls: Poll[];
  };
}> => {
  if (!context.params) {
    return {
      props: {
        user: null,
        userVotes: [],
        representatives: [],
        workshops: [],
        workshopName: '',
        polls: [],
      },
    };
  }

  const user = await userDto(context.params.userId);

  if (!user) {
    return {
      props: {
        user: null,
        userVotes: [],
        representatives: [],
        workshops: [],
        workshopName: '',
        polls: [],
      },
    };
  }

  const userVotes = await userVotesDto(context.params.userId);
  const representatives = await representativesDto();
  const workshops = await workshopsDto();
  const workshopName = await workshopNameDto(user.workshop_id);
  const polls = await pollsDto();

  return {
    props: {
      user: user,
      userVotes: userVotes,
      representatives: representatives,
      workshops: workshops,
      workshopName: workshopName,
      polls: polls,
    },
  };
};
