import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Poll } from '@/types';

interface Props {
  poll: Poll;
}

/**
 * Yes, No, Abstain buttons to vote on a poll
 * @returns Vote on Poll Buttons
 */
export function VoteOnPollButtons(props: Props): JSX.Element {
  const { poll } = props;

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
      >
        Abstain
      </Button>
    </Box>
  );
}
