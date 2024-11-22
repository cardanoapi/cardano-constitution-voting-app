import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Wallet } from '@claritydao/clarity-backend';

const WalletContext = createContext<{
  wallet: Wallet | null;
  updateWallet: (wallet: Wallet) => void;
  // eslint-disable-next-line indent
}>({ wallet: null, updateWallet: () => {} });

/**
 * Wallet context provider to wrap the application in.
 * This provides the wallet object from clarity-backend
 * and a function to update the wallet object.
 * @param children - ReactNode child components
 * @returns WalletContextProvider
 */
export function WalletContextProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  function updateWallet(newWallet: Wallet): void {
    setWallet((prev) => ({ ...prev, ...newWallet }));
  }

  return (
    <WalletContext.Provider value={{ wallet, updateWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext(): {
  wallet: Wallet | null;
  updateWallet: (wallet: Wallet) => void;
  // eslint-disable-next-line indent
} {
  const context = useContext(WalletContext);
  return context;
}
