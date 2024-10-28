import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Poll } from '@/types';
import { castVote } from '@/lib/helpers/castVote';

interface Props {
  poll: Poll;
}

/**
 * Yes, No, Abstain buttons to vote on a poll
 * @returns Vote on Poll Buttons
 */
export function VoteOnPollButtons(props: Props): JSX.Element {
  const { poll } = props;

  function handleVote(vote: string): void {
    castVote(poll.id, vote);
  }

  return (
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
      >
        Abstain
      </Button>
    </Box>
  );
}
