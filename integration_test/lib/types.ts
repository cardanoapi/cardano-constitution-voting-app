import { CardanoTestWalletJson } from '@cardanoapi/cardano-test-wallet/types';

export type StaticWallet = CardanoTestWalletJson & {
  dRepId: string;
  address: string;
};
