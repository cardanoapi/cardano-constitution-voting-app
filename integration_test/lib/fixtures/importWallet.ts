import { CardanoTestWalletJson } from '@cardanoapi/cardano-test-wallet/types';
import { Page } from '@playwright/test';
import { StaticWallet } from '@types';

export async function importWallet(
  page: Page,
  wallet: StaticWallet | CardanoTestWalletJson
): Promise<void> {
  await page.addInitScript((wallet) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.cardanoTestWallet= {wallet: wallet}
  }, wallet);
}


export async function injectWalletExtension(
  page: Page,
  wallet: StaticWallet | CardanoTestWalletJson
): Promise<void> {
  await page.addInitScript((wallet) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.cardanoTestWallet= {wallet: wallet}
    //@ts-ignore

  }, wallet);
}
