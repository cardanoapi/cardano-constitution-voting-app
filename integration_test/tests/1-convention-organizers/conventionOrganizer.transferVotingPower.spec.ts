import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('1. Convention Organizers');
});

test.describe('Voting Power', () => {
  test('1D. Should transfer voting power from delegate to alternate.', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(CCVT.title);
  });

  test('1E. Should transfer voting power from alternate to delegate.', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(CCVT.title);
  });
});
