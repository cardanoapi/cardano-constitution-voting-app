import { useEffect, useState } from 'react';
import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { Poll } from '@/types';
import { getPollVote } from '@/lib/getPollVote';
import { castVote } from '@/lib/helpers/castVote';

interface Props {
  poll: Poll;
  disabled: boolean;
  setDisabled: (value: boolean) => void;
}

/**
 * Yes, No, Abstain buttons to vote on a poll
 * @returns Vote on Poll Buttons
 */
export function VoteOnPollButtons(props: Props): JSX.Element {
  const { poll, disabled, setDisabled } = props;
  const [vote, setVote] = useState('');

  const session = useSession();
  const theme = useTheme();

  async function handleVote(vote: string): Promise<void> {
    setDisabled(true);
    const result = await castVote(poll.id, vote);
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      toast.success('Vote recorded!');
    }
    setDisabled(false);
  }

  // get the user's vote from the db
  useEffect(() => {
    async function getVote(): Promise<void> {
      if (session.data?.user.id) {
        const recordedVote = await getPollVote(session.data?.user.id, poll.id);

        setVote(recordedVote.vote);
      }
    }
    // only fetch the vote after the vote has been recorded
    if (session.data?.user.id && disabled == false) {
      getVote();
    }
  }, [session.data?.user.id, poll.id, disabled]);

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      {vote && (
        <Box display="flex" flexDirection="row" gap={1}>
          <Typography variant="h5" fontWeight="bold">
            Your Vote:
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={
              vote === 'yes'
                ? 'success'
                : vote === 'no'
                  ? 'warning'
                  : theme.palette.text.primary
            }
          >
            {vote.toUpperCase()}
          </Typography>
        </Box>
      )}
      <Typography>{vote ? 'Re-cast' : 'Cast'} your vote:</Typography>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Button
          variant="outlined"
          color="success"
          sx={{
            width: '150px',
          }}
          endIcon={<ThumbUpRounded />}
          size="large"
          onClick={() => handleVote('yes')}
          disabled={disabled}
          data-testid="vote-yes-button"
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          color="warning"
          sx={{
            width: '150px',
          }}
          endIcon={<ThumbDownRounded />}
          size="large"
          onClick={() => handleVote('no')}
          disabled={disabled}
          data-testid="vote-no-button"
        >
          No
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: '150px',
          }}
          endIcon={<DoDisturbRounded />}
          size="large"
          onClick={() => handleVote('abstain')}
          disabled={disabled}
          data-testid="vote-abstain-button"
        >
          Abstain
        </Button>
      </Box>
    </Box>
  );
}
