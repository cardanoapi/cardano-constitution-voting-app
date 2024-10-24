import { useTheme } from '@mui/material';
import { Toaster } from 'react-hot-toast';

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
  const theme = useTheme();
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 7000,
          position: 'top-right',
          style: {
            padding: `${theme.shape.borderRadius}px`,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          success: {
            style: {
              border: '2px solid #4CAF50',
            },
          },
          error: {
            style: {
              border: '2px solid #f44336',
            },
          },
        }}
        containerStyle={{
          top: 100,
          left: 20,
          bottom: 20,
          right: 20,
        }}
      />
      <Sidebar />
      {children}
    </>
  );
}
