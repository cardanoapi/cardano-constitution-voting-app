import { useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import { Box, Button, Drawer, Typography } from '@mui/material';

import { ConnectWalletButton } from '@/components/buttons/connectWalletButton';

/**
 * Sidebar component with links to governance & explore members pages
 * @returns Sidebar Drawer
 */
export function Sidebar(): JSX.Element {
  const [open, setOpen] = useState(false);

  function openDrawer(): void {
    setOpen(true);
  }

  function closeDrawer(): void {
    setOpen(false);
  }

  return (
    <>
      <Button variant="text" onClick={openDrawer}>
        <MenuRounded />
      </Button>
      <Drawer open={open} onClose={closeDrawer}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            minWidth: '250px',
          }}
          p={2}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="text" onClick={closeDrawer} color="error">
              <CloseRounded />
            </Button>
          </Box>
          <ConnectWalletButton />
          <Typography variant="h5" fontWeight="bold">
            Browse Polls
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            Browse Members
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
