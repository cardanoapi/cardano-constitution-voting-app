import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
  alternateColor?: boolean;
}

/**
 * Wraps content in a consistent paper container
 * @returns Widget Container
 */
export function WidgetContainer(props: Props): JSX.Element {
  const { children, alternateColor } = props;
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor:
          alternateColor === true
            ? theme.palette.background.paper
            : theme.palette.background.default,
        boxShadow: theme.shadows[5],
      }}
    >
      {children}
    </Box>
  );
}
