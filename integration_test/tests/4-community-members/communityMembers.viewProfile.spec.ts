import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('4. Community Members');
});

test.describe('View Voter Profile', () => {

  test('4C. Must be able to view voters profile.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });


  test('4D. Must be able to view delegate workspace name in profile.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('4E. Could associate email with delegate profiles.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('4F. Must have vote data linked to voter profile.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('4I. Should be able to view public information of voter.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

});

