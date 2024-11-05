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
import { updateUser } from '@/lib/helpers/updateUser';

/**
 * Allows a workshop coordinator to manage if delegates or alternates have active power from each workhsop
 * @returns Admin Manage Active Power Table
 */
export function ManageActivePowerTable(): JSX.Element {
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [loadingReps, setLoadingReps] = useState(true);
  const [reload, setReload] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoadingReps(true);
      const workshops = await getWorkshops();
      setWorkshops(workshops);
      const reps = await getRepresentatives();
      console.log('reps', reps);
      setRepresentatives(reps);
      setLoadingReps(false);
    }
    fetchData();
  }, []);

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
    // update user name, email, and wallet address
    const data = await updateUser(
      newRow.id,
      newRow.name,
      newRow.email,
      newRow.wallet_address,
    );
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
        editable: true,
        flex: 0.5,
      },
      {
        field: 'delegate_id',
        headerName: 'Delegate',
        width: 280,
        editable: true,
        flex: 0.5,
        renderCell: (params): JSX.Element => {
          const delegateId = params.row.delegate_id;
          const delegate = representatives.find((rep) => {
            if (delegate) {
              console.log('testing', rep.id.toString(), delegateId);
            }
            return rep.id === delegateId;
          });
          if (delegate) console.log('delegate', delegate.name);
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
              <Typography variant="body1">{delegate?.name}</Typography>
              Ju
              <LaunchRounded fontSize="small" />
            </Link>
          );
        },
      },
      {
        field: 'alternate_id',
        headerName: 'Alternate',
        width: 280,
        editable: true,
        flex: 0.5,
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
  }, [workshops, representatives]);

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
      />
    </Box>
  );
}
