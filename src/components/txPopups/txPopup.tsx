import { useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  message: string;
}

/**
 * Transaction in progress popup
 * @param title - Title of the popup
 * @param message - Message of the popup
 * @returns Popup for when a transaction is in progress
 */
export function TxPopup(props: Props): JSX.Element {
  const { title, message } = props;
  const theme = useTheme();

  return (
    <Box display="flex" alignContent="center">
      <Alert
        elevation={6}
        variant="filled"
        severity="warning"
        iconMapping={{
          warning: (
            <Box
              alignItems="center"
              justifyContent="center"
              display="flex"
              minWidth="40px"
            >
              <CircularProgress />
            </Box>
          ),
        }}
      >
        <AlertTitle color={theme.palette.secondary.contrastText}>
          {title}
        </AlertTitle>
        <Typography
          variant="subtitle2"
          color={theme.palette.secondary.contrastText}
        >
          {message}
        </Typography>
      </Alert>
    </Box>
  );
}
