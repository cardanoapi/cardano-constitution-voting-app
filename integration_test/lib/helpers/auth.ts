import { importWallet } from '@fixtures/importWallet';
import LoginPage from '@pages/loginPage';
import { BrowserContext, Page } from '@playwright/test';
import { StaticWallet } from '@types';

interface CreateUserProps {
  page: Page;
  context: BrowserContext;
  wallet: StaticWallet;
  auth: string;
}

export async function createAuth({
  page,
  context,
  wallet,
  auth,
}: CreateUserProps): Promise<void> {
  await importWallet(page, wallet);

  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.isLoggedIn();

  await context.storageState({ path: auth });
}
