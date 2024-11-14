import { organizerWallet } from '@constants/staticWallets';
import { setAllureEpic } from '@helpers/allure';
import { CCVT } from '@mock/index';
import { expect } from '@playwright/test';
import { test } from '@fixtures/walletExtension';
import RepresentativesPage from '@pages/representativesPage';
import HomePage from '@pages/homePage';
import { faker } from '@faker-js/faker';

const workshopInfo = [
  {
    name: 'Dubai',
    delegate_id: BigInt(2),
    alternate_id: BigInt(5),
    active_vote_id: BigInt(2),
  },
  {
    name: 'Singapore',
    delegate_id: BigInt(4),
    alternate_id: BigInt(3),
    active_vote_id: BigInt(3),
  },
  { name: 'Convention Organizer' },
  {
    name: 'Buenos Aires',
    delegate_id: BigInt(8),
    alternate_id: BigInt(7),
    active_vote_id: BigInt(8),
  },
];

test.beforeEach(async () => {
  await setAllureEpic('1. Convention Organizers');
});

test.use({ storageState: '.auth/organizer.json', wallet: organizerWallet });


test.describe('Polls', () => {

  /**
   * Description
   * The Convention Voting Tool (CVT) recognises a Convention Organiser (CO)
   *
   * User Story
   * As a CO I want the CVT to know my status so that I can act on it
   *
   * Acceptance Criteria
   * Given that I am a CO with my wallet connected, When I go to the homepage, Then I see the "create poll" button
   */
  test('1A. Given connected as CO can see create poll button', async ({ page }) => {
    await page.goto('/');
    const CreatePollButton = page.getByTestId('create-poll-button').first();
    await expect(CreatePollButton).toBeVisible();
    await expect(CreatePollButton).toHaveText('Create Poll');
  });
  /**
   * Description
   * Convention Organisers can create a poll
   *
   * User Story
   * As a CO I want the CVT to give me the option to create a poll, so that I can begin the process of creating a poll.
   *
   * Acceptance Criteria
   * Given that I am a CO on the homepage with my wallet connected, when I click the "create poll" button, Then I will go to the create poll page
   */
  test('1B, Given connected as CO can create a new poll', async ({ page, browser }) => {
      await page.goto('/');
      const homePage = new HomePage(page);
      const pollName = faker.commerce.productName();
      const pollDescription = faker.commerce.productDescription();
      await homePage.createPoll(pollName, pollDescription);

      await expect(page.getByText(pollName)).toBeVisible();
      await expect(
          page.getByTestId('poll-status-chip').getByText('Pending')
      ).toBeVisible();
  });

  /**
   * Description: A convention organiser will be able to open a poll to make it available to vote on my delegates and alternates
   *
   * User Stories: As a CO, I want to open a poll, so that those who are eligible to vote can do so.
   *
   * Acceptance Criteria: Given that I am a CO on the poll's page, and the poll is in 'pending' status, then when I click the "open poll" button then the poll is opened.
   */
  test('1C, Given connected as CO can open  poll', async ({ page, browser }) => {
      throw new Error("Not Implemented")
  });
  /**
   * Description: If a poll is open then a CO can close it
   *
   * User Story: As a CO, I want to be able to close a poll so that the results can be calculated
   *
   * Acceptance Criteria: Given that I am a CO on the page of a poll that is in "Open" status, when I click "Close Poll" then the poll is closed.
   */
  test('1D, Given connected as CO can create a new poll', async ({ page, browser }) => {
    throw new Error("Not Implemented")

  });
  /**
   * Description: Once a poll has been closed to voting it cannot be re-opened, and no further votes will be accepted.
   *
   * User Story: As a CO, I do not want to be able to reopen a poll, so that there is no suggestion of vote manipulation.
   *
   * Acceptance Criteria: Given that I am on the page of a closed poll, then there is no button or any other way for me to re-open it.
   */
  test('1E, Given connected as CO can create a new poll', async ({ page, browser }) => {
    throw new Error("Not Implemented")

  });
});


test.describe('User Info', () => {
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
  // As a convention organiser, I want to be able to update the profile information of a delegate (or alternate) to correct any error or omission.
  test('1-Org-Invite: 9. Convention organisers can update delegate profile information ', async ({ page }) => {
    const represntativePage = new RepresentativesPage(page);
    await represntativePage.updateDelegateProfile();
    await represntativePage.isRepresentativeUpdated();
    await represntativePage.updateAlternateProfile();
    await represntativePage.isRepresentativeUpdated();
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
