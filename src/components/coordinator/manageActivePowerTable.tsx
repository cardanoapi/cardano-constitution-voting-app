import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CancelRounded, EditRounded, SaveRounded } from '@mui/icons-material';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';

import { User, Workshop } from '@/types';
import { paths } from '@/paths';
import { getRepresentatives } from '@/lib/helpers/getRepresentatives';
import { getWorkshops } from '@/lib/helpers/getWorkshops';
import { updateActiveVoter } from '@/lib/helpers/updateActiveVoter';

/**
 * Allows a workshop coordinator to manage if delegates or alternates have active power from each workhsop
 * @returns Admin Manage Active Power Table
 */
export function ManageActivePowerTable(): JSX.Element {
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [reload, setReload] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const workshops = await getWorkshops();
      setWorkshops(workshops);
      const reps = await getRepresentatives();
      setRepresentatives(reps);
    }
    fetchData();
  }, [reload]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    setReload(!reload);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    console.log('new row', newRow);
    const data = await updateActiveVoter(newRow.id, newRow.active_voter_id);
    // update active voter id
    if (data.userId !== '-1') {
      toast.success('User info updated!');
    } else {
      toast.error(data.message);
    }
    setReload(!reload);
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'name',
        headerName: 'Workshop',
        width: 280,
        editable: false,
        flex: 0.5,
      },
      {
        field: 'delegate_id',
        headerName: 'Delegate',
        width: 280,
        editable: false,
        flex: 0.5,
        renderCell: (params): JSX.Element => {
          const delegateId = params.row.delegate_id;
          const delegate = representatives.find((rep) => {
            return rep.id === delegateId;
          });
          const isActivePower =
            params.row.delegate_id === params.row.active_voter_id;
          return (
            <Link
              href={paths.representatives.representative + delegateId}
              style={{
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                color: theme.palette.text.primary,
              }}
              data-testid={`delegate-name-${delegate?.id}`}
            >
              <Typography
                variant="body1"
                color={isActivePower ? 'success' : theme.palette.text.primary}
              >
                {delegate?.name}
              </Typography>
              <LaunchRounded fontSize="small" />
            </Link>
          );
        },
      },
      {
        field: 'alternate_id',
        headerName: 'Alternate',
        width: 280,
        editable: false,
        flex: 0.5,
        renderCell: (params): JSX.Element => {
          const alternateId = params.row.alternate_id;
          const alternate = representatives.find((rep) => {
            return rep.id === alternateId;
          });
          const isActivePower =
            params.row.alternate_id === params.row.active_voter_id;
          return (
            <Link
              href={paths.representatives.representative + alternateId}
              style={{
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                color: theme.palette.text.primary,
              }}
              data-testid={`alternate-name-${alternate?.id}`}
            >
              <Typography
                variant="body1"
                color={isActivePower ? 'success' : theme.palette.text.primary}
              >
                {alternate?.name}
              </Typography>
              <LaunchRounded fontSize="small" />
            </Link>
          );
        },
      },
      {
        field: 'active_voter_id',
        headerName: 'Active Voter',
        width: 130,
        editable: true,
        type: 'singleSelect',
        valueOptions: (params) => [
          { value: params.row.delegate_id, label: 'Delegate' },
          { value: params.row.alternate_id, label: 'Alternate' },
        ],
        renderCell: (params): JSX.Element => {
          const activeVoterId = params.row.active_voter_id;
          const delegateId = params.row.delegate_id;
          const alternateId = params.row.alternate_id;
          return (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="100%"
            >
              <Typography>
                {activeVoterId == delegateId
                  ? 'Delegate'
                  : activeVoterId == alternateId
                    ? 'Alternate'
                    : ''}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Edit',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveRounded />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelRounded />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditRounded />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];
  }, [workshops, representatives, rowModesModel]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5" fontWeight="600">
        Manage Active Voters
      </Typography>
      <DataGrid
        rows={workshops}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sortModel={[{ field: 'name', sort: 'asc' }]}
      />
    </Box>
  );
}
