import { organizerWallet } from '@constants/staticWallets';
import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect } from '@playwright/test';
import { test } from '@fixtures/walletExtension';
import RepresentativesPage from '@pages/representativesPage';
import LoginPage from '@pages/loginPage';

test.beforeEach(async () => {
  await setAllureEpic('1. Convention Organizers');
});

test.use({ storageState: '.auth/organizer.json', wallet: organizerWallet });

test.describe('Recognise a Convention Organiser', () => {
  test('1H. Must be able to distinguish CO', async ({ page }) => {
    await page.goto('/');
    const CreatePollButton = page.getByTestId('create-poll-button').first();
    await expect(CreatePollButton).toBeVisible();
    await expect(CreatePollButton).toHaveText('Create Poll');
  });
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

test.describe('Poll results', () => {
  test('1A. Must not edit poll results.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('1J. Must display vote count durin open poll.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('1K. Should display vote count after poll ending.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('1L. Must open polls only after delegates are ready.', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });

  test('1M. Must close polls once voting is completed.', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });
});

test.describe('Delegate and Alternate Profile', () => {
  test('1F. Must have access to update delegate profile', async ({ page }) => {
    const represntativePage = new RepresentativesPage(page);
    await represntativePage.updateDelegateProfile();
    await represntativePage.isRepresentativeUpdated();
    await represntativePage.updateAlternateProfile();
    await represntativePage.isRepresentativeUpdated();
  });

  test('1I. Must have access to create delegate and alternate profile', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(CCVT.title);
  });
});

test.describe('Voting Power', () => {
  test('1D. Should transfer voting power from delegate to alternate.', async ({
    page,
  }) => {
    const representativePage = new RepresentativesPage(page);
    const loginPage = new LoginPage(page);
    await representativePage.transferVotePowerToAlternate();
    await expect(page.getByText('Active voter updated!')).toBeVisible();
  });

  test('1E. Should transfer voting power from alternate to delegate.', async ({
    page,
  }) => {
    const representativePage = new RepresentativesPage(page);
    await representativePage.transferVotePowerToDelegate();
    await expect(page.getByText('Active voter updated!')).toBeVisible();
  });
});
