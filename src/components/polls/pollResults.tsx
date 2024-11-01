import { useEffect, useMemo, useState } from 'react';
import {
  DoNotDisturbOutlined,
  HowToVoteOutlined,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from '@mui/icons-material';
import {
  LinearProgress,
  linearProgressClasses,
  styled,
  Tooltip,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';

import { getPollResults } from '@/lib/helpers/getPollResults';
import { PollResultsVoter } from '@/components/polls/pollResultsVoter';

interface Props {
  pollId: string;
}

const YesLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.main,
  },
}));

const NoLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.warning.main,
  },
}));

const AbstainLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

/**
 * Shows how many votes have been cast on a poll
 * @param pollId - The poll to display information about
 * @returns Poll Vote Count
 */
export function PollResults(props: Props): JSX.Element {
  const { pollId } = props;
  const [votes, setVotes] = useState<{
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
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    async function lookupVoteCount(): Promise<void> {
      setIsLoading(true);
      const data = await getPollResults(pollId);
      if (!data.votes) {
        toast.error(data.message);
      } else {
        setVotes(data.votes);
      }

      setIsLoading(false);
    }
    if (pollId && typeof pollId === 'string') {
      lookupVoteCount();
    }
  }, [pollId]);

  const voteCount = Object.values(votes || {}).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  const yesCount = votes?.yes?.length || 0;
  const noCount = votes?.no?.length || 0;
  const abstainCount = votes?.abstain?.length || 0;

  const yesPercentage = Math.round((yesCount / voteCount) * 100);
  const noPercentage = Math.round((noCount / voteCount) * 100);
  const abstainPercentage = Math.round((abstainCount / voteCount) * 100);

  const noVoters = useMemo((): JSX.Element => {
    return (
      <>
        {votes?.no?.map(({ name, id }) => {
          return <PollResultsVoter name={name} id={id} vote="no" />;
        })}
      </>
    );
  }, [theme, votes]);

  return (
    <>
      {!isLoading && (
        <Box display="flex" flexDirection="column" gap={6} width="100%">
          <Typography variant="h3" fontWeight="bold">
            Results
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            data-testid="results-yes"
          >
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <Typography variant="h5" fontWeight="600">
                Voted:
              </Typography>
              <Typography color="success" variant="h5" fontWeight="600">
                YES
              </Typography>
              <ThumbUpOutlined color="success" />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              gap={1}
              alignItems="center"
              color={theme.palette.text.primary}
            >
              <HowToVoteOutlined />
              <Typography>{yesCount}</Typography>
              <Typography>vote{yesCount === 1 ? '' : 's'}</Typography>
              <Typography>|</Typography>
              <Typography>{yesPercentage}%</Typography>
              <Typography>|</Typography>
              <Box sx={{ width: '100%' }}>
                <YesLinearProgress
                  variant="determinate"
                  value={yesPercentage}
                />
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            data-testid="results-no"
          >
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <Typography variant="h5" fontWeight="600">
                Voted:
              </Typography>
              <Typography color="warning" variant="h5" fontWeight="600">
                NO
              </Typography>
              <ThumbDownOutlined color="warning" />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              gap={1}
              alignItems="center"
              color={theme.palette.text.primary}
            >
              <HowToVoteOutlined />
              <Typography>{noCount}</Typography>
              <Typography>vote{noCount === 1 ? '' : 's'}</Typography>
              <Typography>|</Typography>
              <Typography>{noPercentage}%</Typography>
              <Typography>|</Typography>
              <Box sx={{ width: '100%' }}>
                <NoLinearProgress variant="determinate" value={noPercentage} />
              </Box>
            </Box>
            {noVoters}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            data-testid="results-abstain"
          >
            <Box
              display="flex"
              flexDirection="row"
              gap={1}
              alignItems="center"
              color={theme.palette.text.primary}
            >
              <Typography variant="h5" fontWeight="600">
                Voted:
              </Typography>
              <Typography variant="h5" fontWeight="600">
                ABSTAIN
              </Typography>
              <DoNotDisturbOutlined />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              gap={1}
              alignItems="center"
              color={theme.palette.text.primary}
            >
              <HowToVoteOutlined />
              <Typography>{abstainCount}</Typography>
              <Typography>vote{abstainCount === 1 ? '' : 's'}</Typography>
              <Typography>|</Typography>
              <Typography>{abstainPercentage}%</Typography>
              <Typography>|</Typography>
              <Box sx={{ width: '100%' }}>
                <AbstainLinearProgress
                  variant="determinate"
                  value={abstainPercentage}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
