import { pollPhases } from '@/constants/pollPhases';
import { Chip, useTheme } from '@mui/material';
import Box from '@mui/material/Box';

interface Props {
  status: string;
}

/**
 * A Chip Representing a Poll Status
 * @returns Chip with Status
 */
export function PollStatusChip(props: Props): JSX.Element {
  const { status } = props;
  const theme = useTheme();

  if (!pollPhases.includes(status)) {
    return <></>;
  } else {
    return (
      <Box>
        <Chip
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          variant="filled"
          color={
            status === pollPhases[0]
              ? 'info'
              : status === pollPhases[1]
                ? 'success'
                : 'primary'
          }
        />
      </Box>
    );
  }
}
