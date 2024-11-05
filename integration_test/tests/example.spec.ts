import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import HomePage from '@pages/homePage';
import { expect, test } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('1. Constitutional Convention Voting Tool ');
});

test('1A. Should have title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(CCVT.title);
});

test("1B. Should have heading 'Voting Tool'", async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('home-link')).toHaveText(CCVT.heading);
});

test('1C. Should access homepage', async ({ page }) => {
  // Using page object model

  const homePage = new HomePage(page);
  await homePage.goto();

  await expect(homePage.heading).toBeVisible();
});
