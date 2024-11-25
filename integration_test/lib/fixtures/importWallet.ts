import { CardanoTestWalletJson } from '@cardanoapi/cardano-test-wallet/types';
import { Page } from '@playwright/test';
import { StaticWallet } from '@types';

export async function injectWalletExtension(
  page: Page,
  wallet: StaticWallet | CardanoTestWalletJson
): Promise<void> {
  await page.addInitScript((wallet) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.cardanoTestWallet){
          //@ts-ignore
      window.cardanoTestWallet.wallet=wallet
    }else{
      //@ts-ignore
      window.cardanoTestWallet={wallet}
    }
   
    //@ts-ignore

  }, wallet);
}

export const importWallet = injectWalletExtension