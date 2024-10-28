import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps content in a consistent paper container
 * @returns Widget Container
 */
export function WidgetContainer(props: Props): JSX.Element {
  const { children } = props;
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      {children}
    </Box>
  );
}
