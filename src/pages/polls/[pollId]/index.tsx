/* eslint-disable indent */
import { useCallback, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { pollPhases } from '@/constants/pollPhases';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import type { Poll, User, Workshop } from '@/types';
import { activeVoterDto } from '@/data/activeVoterDto';
import { pollDto } from '@/data/pollDto';
import { pollResultsDto } from '@/data/pollResultsDto';
import { pollsDto } from '@/data/pollsDto';
import { representativesDto } from '@/data/representativesDto';
import { workshopsDto } from '@/data/workshopsDto';
import { getPoll } from '@/lib/helpers/getPoll';
import { getPollResults } from '@/lib/helpers/getPollResults';
import { BeginVoteButton } from '@/components/buttons/beginVoteButton';
import { DeletePollButton } from '@/components/buttons/deletePollButton';
import { EndVoteButton } from '@/components/buttons/endVoteButton';
import { PutVotesOnChainButton } from '@/components/buttons/putVotesOnChainButton';
import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';
import { PollCarrousel } from '@/components/polls/pollCarrousel';
import { PollResults } from '@/components/polls/pollResults';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
import { PollVoteCount } from '@/components/polls/pollVoteCount';
import { RepresentativesTable } from '@/components/representatives/representativesTable';

interface Props {
  poll: Poll | null;
  representatives: User[];
  workshops: Workshop[];
  pollResultsSSR: {
    yes: {
      name: string;
      id: string;
    }[];
    no: {
      name: string;
      id: string;
    }[];
    abstain: {
      name: string;
      id: string;
    }[];
  };
  polls: Poll[];
  workshopActiveVoterId: string;
}

export default function ViewPoll(props: Props): JSX.Element {
  const {
    representatives,
    workshops,
    pollResultsSSR,
    polls,
    workshopActiveVoterId,
  } = props;
  let { poll } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollResults, setPollResults] = useState(pollResultsSSR);

  const session = useSession();
  const router = useRouter();
  const { pollId } = router.query;

  // Using react-query to fetch and refresh the vote count
  const { isPending, error, data } = useQuery({
    queryKey: ['poll', pollId],
    queryFn: async () => {
      if (typeof pollId === 'string') {
        const data = await getPoll(pollId);
        const pollResults = await getPollResults(pollId);
        if (pollResults.votes) {
          setPollResults(pollResults.votes);
        }
        return data;
      }
    },
    enabled: typeof pollId === 'string' && pollId !== '',
    refetchInterval: 5000, // refresh every 5 seconds
  });

  const updateIsSubmitting = useCallback((value: boolean) => {
    setIsSubmitting(value);
  }, []);

  const updatePollResults = useCallback(
    (newPollResults: {
      yes: {
        name: string;
        id: string;
      }[];
      no: {
        name: string;
        id: string;
      }[];
      abstain: {
        name: string;
        id: string;
      }[];
    }) => {
      setPollResults(newPollResults);
    },
    [],
  );

  if (data && data.poll) {
    poll = data.poll;
  }

  if (error) {
    toast.error(data?.message || error?.message || 'Error fetching poll');
  }

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
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            display="flex"
            flexDirection="row"
            gap={3}
            justifyContent={{ xs: 'space-between', lg: 'flex-start' }}
            alignItems="center"
          >
            <Typography variant="h1" fontWeight="bold">
              {poll ? (
                poll.name
              ) : isPending ? (
                <CircularProgress />
              ) : (
                'View Poll'
              )}
            </Typography>
            {poll && <PollStatusChip status={poll.status} />}
          </Box>
          <PollVoteCount pollId={poll?.id || ''} />
          <Grid container data-testid="poll-description">
            {poll ? (
              <Grid size={{ xs: 12, lg: 6 }}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography variant="h6">{poll.description}</Typography>
                </Box>
              </Grid>
            ) : (
              !isPending && <Typography variant="h4">Poll not found</Typography>
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
                    {session.data?.user.isCoordinator && (
                      <>
                        <Typography>Manage Poll:</Typography>
                        <Box
                          display="flex"
                          flexDirection="row"
                          gap={1}
                          alignItems="center"
                        >
                          {poll.status === pollPhases.pending && (
                            <BeginVoteButton
                              pollId={pollId}
                              isSubmitting={isSubmitting}
                              setIsSubmitting={updateIsSubmitting}
                            />
                          )}
                          {poll.status === pollPhases.voting && (
                            <EndVoteButton
                              pollId={pollId}
                              isSubmitting={isSubmitting}
                              setIsSubmitting={updateIsSubmitting}
                              updatePollResults={updatePollResults}
                            />
                          )}
                          {poll.status === pollPhases.concluded &&
                            !poll.summary_tx_id && (
                              <PutVotesOnChainButton
                                pollId={pollId}
                                isSubmitting={isSubmitting}
                                setIsSubmitting={updateIsSubmitting}
                              />
                            )}
                          <DeletePollButton
                            pollId={pollId}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={updateIsSubmitting}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                  {/* Delegate Voting Buttons */}
                  {poll.status === pollPhases.voting && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      alignItems="center"
                    >
                      <VoteOnPollButtons
                        pollId={poll.id}
                        disabled={isSubmitting}
                        setDisabled={updateIsSubmitting}
                        isActiveVoter={
                          workshopActiveVoterId === session.data?.user.id
                        }
                      />
                    </Box>
                  )}
                  {/* Vote Results */}
                  {poll.status === pollPhases.concluded &&
                    typeof pollId === 'string' && (
                      <PollResults votes={pollResults} pollId={pollId} />
                    )}
                </Box>
              </Grid>
            )}
          </Grid>
          <Box display="flex" flexDirection="column" gap={3} mt={10}>
            {/* Browse Other Polls Carrousel */}
            <PollCarrousel currentPollId={pollId} polls={polls} />
            <RepresentativesTable
              representatives={representatives}
              workshops={workshops}
            />
          </Box>
        </Box>
      </main>
    </>
  );
}

type Params = {
  pollId: string;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<Params>,
): Promise<{
  props: {
    poll: Poll | null;
    representatives: User[];
    workshops: Workshop[];
    pollResultsSSR: {
      [key: string]: {
        name: string;
        id: string;
      }[];
    };
    polls: Poll[];
    workshopActiveVoterId: string;
  };
}> => {
  if (!context.params) {
    return {
      props: {
        poll: null,
        representatives: [],
        workshops: [],
        pollResultsSSR: {},
        polls: [],
        workshopActiveVoterId: '',
      },
    };
  }

  const { pollId } = context.params;

  const session = await getServerSession(context.req, context.res, authOptions);

  let workshopActiveVoterId = '';
  if (session) {
    const activeVoterId = await activeVoterDto(session.user.id);
    if (activeVoterId) {
      workshopActiveVoterId = activeVoterId;
    }
  }

  const poll = await pollDto(pollId);
  const representatives = await representativesDto();
  const workshops = await workshopsDto();
  const pollResultsSSR = await pollResultsDto(pollId);
  const polls = await pollsDto();

  return {
    props: {
      poll: poll,
      representatives: representatives,
      workshops: workshops,
      pollResultsSSR: pollResultsSSR,
      polls: polls,
      workshopActiveVoterId: workshopActiveVoterId,
    },
  };
};
