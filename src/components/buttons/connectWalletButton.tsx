import { useMemo, useState } from 'react';
import { walletOptions } from '@/constants/walletOptions';
import CircleRounded from '@mui/icons-material/CircleRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';

import { connectWallet } from '@/lib/connectWallet';

/**
 * A button to connect a wallet to a variety of cip-30 compatible wallets
 * @returns Connect Wallet Button
 */
export function ConnectWalletButton(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [connecting, setConnecting] = useState(false);

  const session = useSession();
  const theme = useTheme();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose(): void {
    setAnchorEl(null);
    setOpen(false);
  }

  // dropdown menu to select Cardano wallet from available wallets in browser
  const wallets = useMemo(() => {
    async function connect(walletName: string): Promise<void> {
      setConnecting(true);
      await connectWallet(walletName);
      setConnecting(false);
      handleClose();
    }

    // filter wallets by the wallets this browser has installed
    let userWallets;
    if (typeof window !== 'undefined') {
      userWallets = walletOptions.filter(
        // @ts-expect-error cardano is actually a proper function on windows
        (wallet) => window?.cardano?.[Object.keys(wallet)[0]],
      );
    } else {
      userWallets = walletOptions;
    }

    const userWalletButtons = userWallets.map((wallet) => {
      const walletName = Object.values(wallet)[0];
      const walletConnectName = Object.keys(wallet)[0];
      return (
        <MenuItem
          onClick={() => {
            handleClose();
            connect(walletConnectName);
          }}
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
    });

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
          <MenuItem
            sx={{
              minWidth: '200px',
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => signOut()}
              fullWidth
            >
              Disconnect
            </Button>
          </MenuItem>
        ) : (
          userWalletButtons
        )}
      </Menu>
    );
  }, [anchorEl, open, connecting, session]);

  return (
    <Box display="flex" flexDirection="row" gap={1} alignItems="center">
      {session.status === 'authenticated' && (
        <Typography
          fontWeight="500"
          display={{
            xs: 'none',
            md: 'flex',
          }}
        >
          Welcome
        </Typography>
      )}
      <Button
        variant={session.status === 'authenticated' ? 'outlined' : 'contained'}
        color={session.status === 'authenticated' ? 'success' : 'secondary'}
        id="connect-wallet"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={
          session.status === 'authenticated' ? (
            <Box
              sx={{
                fontSize: '0.85rem !important',
              }}
              justifyContent="center"
              display="flex"
            >
              <CircleRounded fontSize="inherit" />
            </Box>
          ) : (
            <></>
          )
        }
      >
        <Typography
          sx={{
            maxWidth: '150px',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            color:
              session.status === 'authenticated'
                ? theme.palette.success.main
                : theme.palette.text.secondary,
          }}
        >
          {session.status === 'authenticated'
            ? session.data.user.stakeAddress
            : 'Connect Wallet'}
        </Typography>
      </Button>
      {session.status === 'authenticated' && (
        <Typography color="success" fontWeight="500">
          Wallet connected
        </Typography>
      )}
      {wallets}
    </Box>
  );
}
