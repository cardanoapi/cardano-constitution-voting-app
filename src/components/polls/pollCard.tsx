import Link from 'next/link';
import { pollPhases } from '@/constants/pollPhases';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { Poll } from '@/types';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
import { PollVoteCount } from '@/components/polls/pollVoteCount';
import { WidgetContainer } from '@/components/widgetContainer';

interface Props {
  poll: Poll;
}

/**
 * One poll card for homepage & carrousel
 * @param poll - The poll to display
 * @returns Poll Card
 */
export function PollCard(props: Props): JSX.Element {
  const { poll } = props;

  const theme = useTheme();

  return (
    <Link
      href={`/polls/${poll.id}`}
      style={{
        textDecoration: 'none',
        color: theme.palette.text.primary,
        height: '100%',
      }}
    >
      <WidgetContainer>
        <Box display="flex" flexDirection="column" gap={1} height="100%">
          <Typography variant="h5" fontWeight="bold">
            {poll.name}
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: 'column', lg: 'row' }}
            alignItems="center"
            gap={1}
          >
            <PollStatusChip status={poll.status} />
            {poll.status !== pollPhases.pending && (
              <PollVoteCount pollId={poll.id} />
            )}
          </Box>
          <Typography variant="body1">{poll.description}</Typography>
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
  );
}
