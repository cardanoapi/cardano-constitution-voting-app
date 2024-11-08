import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('1. Convention Organizers');
});

test.describe('Delegate and Alternate Profile', () => {
  test('1F. Must have access to update delegate and alternate profile', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('1I. Must have access to create delegate and alternate profile', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });
});

