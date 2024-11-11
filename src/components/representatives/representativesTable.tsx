import Link from 'next/link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import type { User, Workshop } from '@/types';
import { paths } from '@/paths';

interface Props {
  representatives: User[];
  workshops: Workshop[];
}

/**
 * A Table with all Representatives grouped by their Workshop
 * @param representatives - List of Representatives
 * @param workshops - List of Workshops
 * @returns Representatives Table
 */
export function RepresentativesTable(props: Props): JSX.Element {
  const { representatives, workshops } = props;

  const theme = useTheme();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 125,
      flex: 1,
    },
    {
      field: 'Delegate',
      headerName: 'Delegate',
      minWidth: 125,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params): JSX.Element => {
        const delegateId = params.row.delegate_id;
        const delegate = representatives.find((rep) => rep.id === delegateId);
        const activeVoterId = params.row.active_voter_id;
        return (
          <Link
            href={paths.representatives.representative + delegateId}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
            }}
            data-testid={`delegate-name-${delegate?.id}`}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{
                xs: 0,
                sm: 1,
              }}
            >
              <Typography color={delegateId === activeVoterId ? 'success' : ''}>
                {delegate?.name}
              </Typography>
              <LaunchRounded fontSize="small" />
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'alternate',
      headerName: 'Alternate',
      minWidth: 125,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params): JSX.Element => {
        const alternateId = params.row.alternate_id;
        const alternate = representatives.find((rep) => rep.id === alternateId);
        const activeVoterId = params.row.active_voter_id;
        return (
          <Link
            href={paths.representatives.representative + alternateId}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
            }}
            data-testid={`alternate-name-${alternate?.id}`}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{
                xs: 0,
                sm: 1,
              }}
            >
              <Typography
                color={alternateId === activeVoterId ? 'success' : ''}
              >
                {alternate?.name}
              </Typography>
              <LaunchRounded fontSize="small" />
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'active_voter',
      headerName: 'Active Voter',
      minWidth: 125,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params): JSX.Element => {
        const activeVoterId = params.row.active_voter_id;
        const activeVoter = representatives.find(
          (rep) => rep.id === activeVoterId,
        );
        return (
          <Link
            href={paths.representatives.representative + activeVoterId}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
            }}
            data-testid={`active-voter-name-${activeVoter?.id}`}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{
                xs: 0,
                sm: 1,
              }}
            >
              <Typography noWrap>{activeVoter?.name}</Typography>
              <LaunchRounded fontSize="small" />
            </Box>
          </Link>
        );
      },
    },
  ];

  if (representatives.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={1} width="100%">
        <Typography variant="h6" fontWeight="600" textAlign="center">
          Representatives
        </Typography>
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
          sortModel={[
            {
              field: 'name',
              sort: 'asc',
            },
          ]}
        />
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
