import { useMemo, useState } from 'react';
import { walletOptions } from '@/constants/walletOptions';
import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';

import { connectWallet } from '@/lib/connectWallet';

/**
 * A button to connect a wallet to a variety of cip-30 compatible wallets
 * @returns Sidebar Drawer
 */
export function ConnectWalletButton(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connecting, setConnecting] = useState(false);

  const session = useSession();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose(): void {
    setAnchorEl(null);
    setOpen(false);
  }

  const wallets = useMemo(() => {
    async function connect(walletName: string): Promise<void> {
      setConnecting(true);
      await connectWallet(walletName);
      setConnecting(false);
      handleClose();
    }

    // filter wallets by the wallets this browser has installed
    const userWallets = walletOptions.filter(
      // @ts-expect-error cardano is actually a proper function on windows
      (wallet) => window?.cardano?.[Object.keys(wallet)[0]],
    );

    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {session.status === 'authenticated' ? (
          <Box>
            <Button variant="contained" color="error" onClick={() => signOut()}>
              Disconnect
            </Button>
          </Box>
        ) : (
          userWallets.map((wallet) => {
            const walletName = Object.values(wallet)[0];
            const walletConnectName = Object.keys(wallet)[0];
            return (
              <MenuItem
                onClick={() => connect(walletConnectName)}
                disabled={connecting}
                key={walletName}
                sx={{
                  minWidth: '200px',
                  fontWeight: 500,
                }}
              >
                {walletName}
              </MenuItem>
            );
          })
        )}
      </Menu>
    );
  }, [anchorEl, open, connecting, session]);

  return (
    <>
      <Button
        variant="contained"
        id="connect-wallet"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={
          session.status === 'authenticated' ? <CheckRounded /> : <></>
        }
      >
        <Typography
          sx={{
            maxWidth: '150px',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {session.status === 'authenticated'
            ? session.data.user.stakeAddress
            : 'Connect Wallet'}
        </Typography>
      </Button>
      {wallets}
    </>
  );
}
