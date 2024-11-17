import { importWallet } from '@fixtures/importWallet';
import loadDemosExtension from '@fixtures/loadExtension';
import { Browser, Page } from '@playwright/test';
import { StaticWallet } from '@types';
import {
  alternate2Wallet,
  alternate3Wallet,
  delegate2Wallet,
  delegate3Wallet,
  delegate1Wallet,
  organizer1Wallet,
  alternate1Wallet,
} from '@constants/staticWallets';

interface NewPageConfig {
  storageState?: string;
  wallet: StaticWallet;
  enableStakeSigning?: boolean;
  supportedExtensions?: Record<string, number>[];
}

export async function createNewPageWithWallet(
  browser: Browser,
  newPageConfig: NewPageConfig
): Promise<Page> {
  const { storageState, wallet, ...extensionConfig } = newPageConfig;

  const context = await browser.newContext({
    storageState,
  });
  const newPage = await context.newPage();

  await loadDemosExtension(
    newPage,
    extensionConfig.enableStakeSigning,
    extensionConfig.supportedExtensions
  );
  await importWallet(newPage, wallet);

  return newPage;
}
export async function newOrganizer1Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/organizer1.json',
    wallet: organizer1Wallet,
  });
}

export async function newDelegate1Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/delegate1.json',
    wallet: delegate1Wallet,
  });
}

export async function newAlternate1Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/alternate1.json',
    wallet: alternate1Wallet,
  });
}

export async function newDelegate2Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/delegate2.json',
    wallet: delegate2Wallet,
  });
}
export async function newAlternate2Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/alternate2.json',
    wallet: alternate2Wallet,
  });
}

export async function newDelegate3Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/delegate3.json',
    wallet: delegate3Wallet,
  });
}

export async function newAlternate3Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/alternate3.json',
    wallet: alternate3Wallet,
  });
}
