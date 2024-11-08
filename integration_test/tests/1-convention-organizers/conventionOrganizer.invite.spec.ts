import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('1. Convention Organizers');
});

test.describe('Invitation', () => {
  test('1B. Could invite delegates', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });
  test('1C. Could invite alternates', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });
});
