import Box from '@mui/material/Box';

import { Sidebar } from '@/components/layout/mobileSidebar';

interface Props {
  children: React.ReactNode;
}

/**
 * Describes the Layout of the App UI. Renders app content with Sidebar
 * @returns Layout Component
 */
export function Layout(props: Props): JSX.Element {
  const { children } = props;
  return (
    <>
      <Sidebar />
      <Box
        sx={{
          px: {
            xs: 2,
            sm: 4,
            md: 10,
            lg: 16,
            xl: 24,
          },
          pb: 4,
        }}
      >
        {children}
      </Box>
    </>
  );
}
