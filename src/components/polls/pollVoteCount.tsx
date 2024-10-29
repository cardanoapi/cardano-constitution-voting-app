import { useEffect, useState } from 'react';
import { HowToVoteRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    async function lookupVoteCount(): Promise<void> {
      setIsLoading(true);
      const votes = await getPollVoteCount(pollId);
      if (votes.error) {
        toast.error(votes.error);
        setCount(0);
      } else {
        setCount(votes.votes);
      }

      setIsLoading(false);
    }
    lookupVoteCount();
  }, [pollId]);

  return (
    <>
      {!isLoading && (
        <Box
          display="flex"
          flexDirection="row"
          gap={1}
          alignItems="center"
          color={theme.palette.text.primary}
        >
          <HowToVoteRounded />
          <Typography variant="body1">
            {count} vote{count === 1 ? '' : 's'}
          </Typography>
        </Box>
      )}
    </>
  );
}
