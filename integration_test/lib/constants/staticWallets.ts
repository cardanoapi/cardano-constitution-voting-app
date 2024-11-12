// eslint-disable-next-line @typescript-eslint/no-require-imports
const staticWallets: StaticWallet[] = require('../_mock/wallets.json');
import { StaticWallet } from '@types';

export const organizerWallet = staticWallets[0];

export const delegateWallet = staticWallets[1];
export const alternateWallet = staticWallets[2];
