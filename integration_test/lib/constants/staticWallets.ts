// eslint-disable-next-line @typescript-eslint/no-require-imports
const staticWallets: StaticWallet[] = require('../_mock/wallets.json');
import { StaticWallet } from '@types';

export const organizerWallet = staticWallets[0];

export const delegateWallet = staticWallets[1];
export const alternateWallet = staticWallets[2];

export const delegate2Wallet = staticWallets[3];
export const alternate2Wallet = staticWallets[4];

export const delegate3Wallet = staticWallets[5];
export const alternate3Wallet = staticWallets[6];
