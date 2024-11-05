import { useEffect, useState } from 'react';
import { CancelRounded, EditRounded, SaveRounded } from '@mui/icons-material';
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

import { User } from '@/types';
import { getRepresentatives } from '@/lib/helpers/getRepresentatives';
import { updateUser } from '@/lib/helpers/updateUser';

/**
 * Table for admin to manage representative information
 * @returns Admin Manage Representatives Table
 */
export function ManageRepresentativesTable(): JSX.Element {
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [reload, setReload] = useState(false);

  // loads representatives from the database
  useEffect(() => {
    async function fetchRepresentatives(): Promise<void> {
      const representatives = await getRepresentatives();
      setRepresentatives(representatives);
    }
    fetchRepresentatives();
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

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 280,
      editable: true,
      flex: 0.5,
    },
    {
      field: 'email',
      headerName: 'Email',
      type: 'string',
      width: 280,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      flex: 0.5,
    },
    {
      field: 'wallet_address',
      headerName: 'Stake Address',
      type: 'string',
      width: 550,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      flex: 1,
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
              data-testid={`save-representative-info-${id}`}
            />,
            <GridActionsCellItem
              icon={<CancelRounded />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              data-testid={`cancel-representative-info-${id}`}
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
            data-testid={`edit-representative-info-${id}`}
          />,
        ];
      },
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5" fontWeight="600">
        Manage Representative Information
      </Typography>
      <DataGrid
        rows={representatives}
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
