import { HowToVoteRounded } from '@mui/icons-material';
import { CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { getPollVoteCount } from '@/lib/helpers/getPollVoteCount';

interface Props {
  pollId: string;
}

/**
 * Shows how many votes have been cast on a poll
 * @param pollId - The poll to display information about
 * @returns Poll Vote Count
 */
export function PollVoteCount(props: Props): JSX.Element {
  const { pollId } = props;

  const theme = useTheme();

  // Using react-query to fetch and refresh the vote count
  const { isPending, error, data } = useQuery({
    queryKey: ['pollVoteCount', pollId],
    queryFn: async () => {
      const data = await getPollVoteCount(pollId);
      return data.votes;
    },
    enabled: typeof pollId === 'string' && pollId !== '',
    refetchInterval: 5000, // refresh every 5 seconds
  });

  if (isPending) {
    return <CircularProgress />;
  } else if (error) {
    toast.error(error.message);
    return <></>;
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={1}
      alignItems="center"
      color={theme.palette.text.primary}
      data-testid="poll-vote-count"
    >
      <HowToVoteRounded />
      <Typography variant="body1">
        {data} vote{data === 1 ? '' : 's'}
      </Typography>
    </Box>
  );
}
