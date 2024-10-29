import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';

import type { User, Workshop } from '@/types';
import { getRepresentatives } from '@/lib/helpers/getRepresentatives';
import { getWorkshops } from '@/lib/helpers/getWorkshops';

/**
 * A Table with all Representatives grouped by their Workshop
 * @returns Poll List
 */
export function RepresentativesTable(): JSX.Element {
  const [loadingReps, setLoadingReps] = useState(true);
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  const theme = useTheme();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoadingReps(true);
      const workshops = await getWorkshops();
      setWorkshops(workshops);
      const reps = await getRepresentatives();
      setRepresentatives(reps);
      setLoadingReps(false);
    }
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'Delegate',
      headerName: 'Delegate',
      minWidth: 150,
      flex: 1,
      renderCell: (params): JSX.Element => {
        const delegateId = params.row.delegate_id;
        const delegate = representatives.find((rep) => rep.id === delegateId);
        return (
          <Link
            href={`/browse/representatives/${params.value}`}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Typography variant="body1">{delegate?.name}</Typography>
            <LaunchRounded fontSize="small" />
          </Link>
        );
      },
    },
    {
      field: 'alternate',
      headerName: 'Alternate',
      minWidth: 150,
      flex: 1,
      renderCell: (params): JSX.Element => {
        const alternateId = params.row.alternate_id;
        const alternate = representatives.find((rep) => rep.id === alternateId);
        return (
          <Link
            href={`/browse/representatives/${params.value}`}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Typography variant="body1">{alternate?.name}</Typography>
            <LaunchRounded fontSize="small" />
          </Link>
        );
      },
    },
    {
      field: 'active_voter',
      headerName: 'Active Voter',
      minWidth: 150,
      flex: 1,
      renderCell: (params): JSX.Element => {
        const activeVoterId = params.row.active_voter_id;
        const activeVoter = representatives.find(
          (rep) => rep.id === activeVoterId,
        );
        return (
          <Link
            href={`/browse/representatives/${params.value}`}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Typography variant="body1">{activeVoter?.name}</Typography>
            <LaunchRounded fontSize="small" />
          </Link>
        );
      },
    },
  ];

  if (loadingReps) {
    return <></>;
  } else if (representatives.length > 0) {
    return (
      <DataGrid
        rows={workshops}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        columnVisibilityModel={{
          id: false,
        }}
      />
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No Representatives found.
      </Typography>
    );
  }
}
