import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

export function dismissToast(text: string): void {
  toast.error(
    (t) => (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignContent="flex-start"
      >
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '300px',
          }}
        >
          {text}
        </div>
        <Button
          onClick={() => toast.dismiss(t.id)} // Close the toast programmatically
          variant="contained"
          color="error"
          style={{
            marginLeft: '10px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
          data-testid="dismiss-toast"
        >
          Dismiss
        </Button>
      </Box>
    ),
    {
      duration: Infinity,
    },
  );
}
