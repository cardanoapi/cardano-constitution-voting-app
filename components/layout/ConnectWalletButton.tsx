import { Button } from '@mui/material';

import connectWallet from '../../lib/helpers/connectWallet';

/**
 * A button to connect a wallet to a variety of cip-30 compatible wallets
 * @returns Sidebar Drawer
 */
const ConnectWalletButton = (): JSX.Element => {
  async function connect(walletName: string): Promise<void> {
    await connectWallet(walletName);
  }

  return (
    <Button variant="contained" onClick={() => connect('nami')}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
