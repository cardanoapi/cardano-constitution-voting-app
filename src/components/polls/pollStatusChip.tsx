import { pollPhases } from '@/constants/pollPhases';
import { CircleRounded } from '@mui/icons-material';
import { Chip, Typography, useTheme } from '@mui/material';
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
          label={
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
              <Typography>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Typography>
              <Box
                sx={{ fontSize: '0.75rem' }}
                justifyContent="center"
                display="flex"
              >
                <CircleRounded
                  fontSize="inherit"
                  color={
                    status === pollPhases[0]
                      ? 'warning'
                      : status === pollPhases[1]
                        ? 'success'
                        : 'primary'
                  }
                />
              </Box>
            </Box>
          }
          variant="filled"
          color={
            status === pollPhases[0]
              ? 'warning'
              : status === pollPhases[1]
                ? 'success'
                : 'primary'
          }
        />
      </Box>
    );
  }
}
