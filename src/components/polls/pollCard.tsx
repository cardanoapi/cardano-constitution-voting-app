import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

import type { Poll } from '@/types';
import { getPolls } from '@/lib/getPolls';
import { PollStatusChip } from '@/components/polls/pollStatusChip';
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
          <Box
            display="flex"
            flexDirection={{ xs: 'column', xl: 'row' }}
            alignItems="center"
            gap={1}
          >
            <Typography variant="h5" fontWeight="bold">
              {poll.name}
            </Typography>
            <PollStatusChip status={poll.status} />
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
