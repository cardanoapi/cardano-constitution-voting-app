import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('3. Alternates');
});

test.describe('Alternate View Vote', () => {

  test('3C. Must be able to view vote result and its count.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('3D. Must be able to view own vote during open poll', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

});

