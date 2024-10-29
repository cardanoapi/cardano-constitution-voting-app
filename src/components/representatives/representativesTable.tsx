import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { workshop } from '@prisma/client';
import { useSession } from 'next-auth/react';

import type { User } from '@/types';
import { getRepresentatives } from '@/lib/helpers/getRepresentatives';

/**
 * A Table with all Representatives grouped by their Workshop
 * @returns Poll List
 */
export function RepresentativesTable(): JSX.Element {
  const [loadingReps, setLoadingReps] = useState(true);
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<workshop[]>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoadingReps(true);
      // const workshops = await getWorkshops();
      // setWorkshops(workshops);
      const reps = await getRepresentatives();
      setRepresentatives(reps);
      setLoadingReps(false);
    }
    fetchData();
  }, []);

  const session = useSession();
  const theme = useTheme();

  if (loadingReps) {
    return <></>;
  } else if (representatives.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {session.status !== 'authenticated' && (
          <Typography textAlign="center">
            Anyone can browse the polls and view results without connecting a
            wallet:
          </Typography>
        )}
        <Grid container spacing={2}></Grid>
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No Representatives found.
      </Typography>
    );
  }
}
