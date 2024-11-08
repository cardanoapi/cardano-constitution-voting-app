import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('2. Constitutional Delegates');
});

test.describe('Delegate View Vote', () => {

  test('2F. Must be able to view vote result and its count', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('2G. Must be able to view own vote during open poll', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('2I. Should not be able to view poll result before poll closing', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });
});

