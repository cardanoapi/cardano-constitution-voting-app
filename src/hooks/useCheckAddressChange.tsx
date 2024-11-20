import { useEffect } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import { connectWallet } from '@claritydao/clarity-backend';
import { signOut, useSession } from 'next-auth/react';

import { checkAddressChange } from '@/lib/checkAddressChange';

/**
 * This hook checks if the user has changed their wallet since connecting.
 * If the user has changed their wallet, it will sign them out.
 */
export function useCheckAddressChange(): void {
  const { data: session } = useSession();
  const { wallet, updateWallet } = useWalletContext();

  useEffect(() => {
    checkAddress();

    async function checkAddress() {
      if (!wallet && session) {
        const walletObject = await connectWallet(session.user.walletName);
        updateWallet(walletObject);
      }

      async function handler(): Promise<void> {
        if (session && wallet) {
          const hasChanged = await checkAddressChange(
            wallet,
            session.user.stakeAddress,
          );
          if (hasChanged) {
            await signOut({ callbackUrl: '/' });
          }
        }
      }

      // Run the function every second
      const intervalId = setInterval(handler, 1000);

      // Cleanup interval on unmount
      return (): void => clearInterval(intervalId);
    }
  }, [session, wallet, updateWallet]);
}
