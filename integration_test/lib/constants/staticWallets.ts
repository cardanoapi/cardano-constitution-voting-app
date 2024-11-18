// eslint-disable-next-line @typescript-eslint/no-require-imports

type MockData = {
  alternates: StaticWallet[];
  delegates: StaticWallet[];
  organizers: StaticWallet[];
};

const staticWallets: MockData = require('../_mock/wallets.json');
import { StaticWallet } from '@types';

export const delegateWallets: StaticWallet[] = staticWallets.delegates;
export const alternateWallets: StaticWallet[] = staticWallets.alternates;
export const organizerWallets: StaticWallet[] = staticWallets.organizers;
