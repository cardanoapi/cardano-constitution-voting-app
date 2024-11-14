import { delegateWallet, organizerWallet } from '@constants/staticWallets';
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

test.describe('Polls', () => {
  test('1XX, Can create poll with valid data', async ({ page, browser }) => {
    await page.goto('/polls/new');
    await page
      .locator('[data-testid="poll-name-input"] input')
      .fill('Dummy Test Poll');
    await page
      .locator('[data-testid="poll-description-input"] textarea')
      .first()
      .fill('Test Poll Description');
    await page.getByTestId('create-poll-button').click();

    await expect(page.getByText('Dummy Test Poll')).toBeVisible();
    await expect(
      page.getByTestId('poll-status-chip').getByText('Pending')
    ).toBeVisible();
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

test.describe('Delegates and Alternates Grouped together', () => {
  test('1N. Should have corresponding workspace delegate and alternate in a same row', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('row').first()).toBeVisible();
    const delegate = await page.getByRole('gridcell').nth(1).innerText();
    const alternate = await page.getByRole('gridcell').nth(2).innerText();
    const delegatesList = await page
      .locator('[data-testid^="delegate-name-"]')
      .allInnerTexts();
    const alternateList = await page
      .locator('[data-testid^="alternate-name-"]')
      .allInnerTexts();
    expect(delegatesList).toContain(delegate);
    expect(alternateList).toContain(alternate);
  });

  test('1O. Should have workspace_name ordered alphabetically', async ({
    page,
  }) => {
    const workspaceNames = [];
    await page.goto('/');
    await expect(page.getByRole('row').first()).toBeVisible();
    const rows = await page.getByRole('row').all();
    rows.shift();
    for (const row of rows) {
      const workspace = (await row.allInnerTexts())[0].split('\n')[0];
      workspaceNames.push(workspace);
    }
    expect(
      workspaceNames.every(
        (word, i) => i === 0 || workspaceNames[i - 1].localeCompare(word) <= 0
      )
    );
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
  test('1D. Should be able to switch active voting power between delegate and alternate.', async ({
    page,
  }) => {
    const representativePage = new RepresentativesPage(page);
    await representativePage.switchVotingPower();
    await expect(page.getByText('Active voter updated!')).toBeVisible();
  });

  test('1E. Should transfer voting power from alternate to delegate.', async ({
    page,
  }) => {
    const representativePage = new RepresentativesPage(page);
    await representativePage.switchVotingPower();
    await expect(page.getByText('Active voter updated!')).toBeVisible();
  });
});
