import { setAllureEpic } from '@helpers/allure';
import LoginPage from '@pages/loginPage';
import { test } from '@fixtures/walletExtension';
import { organizerWallet } from '@constants/staticWallets';
import { expect } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('5. Wallet connect');
});
test.use({ wallet: organizerWallet });

test('5A. Should connect wallet if stake key is registered', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.isLoggedIn();
});

test('5B. Should disconnect Wallet When connected', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();

  await loginPage.logout();
  await expect(page.getByTestId('create-poll-button').first()).toBeVisible();
});
