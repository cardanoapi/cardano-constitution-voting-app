import { organizerWallet } from '@constants/staticWallets';
import { setAllureEpic } from '@helpers/allure';
import { expect } from '@playwright/test';
import { test } from '@fixtures/poll';
import RepresentativesPage from '@pages/representativesPage';
import HomePage from '@pages/homePage';
import { faker } from '@faker-js/faker';
import PollPage from '@pages/pollPage';

test.beforeEach(async () => {
  await setAllureEpic('1. Convention Organizers');
});

test.use({ storageState: '.auth/organizer.json', wallet: organizerWallet });

/**
 * Description: Convention Organisers can delete a poll, so that it no longer appears on the list of historical polls
 *
 * User Story: As a CO I want to be able to delete a poll so that no user of the CVT will be able to see the results of old tests or mistakenly created polls.
 *
 * Acceptance Criteria: Given that I am a CO on the page of a given poll, when I press the delete button I will be asked in a modal if I am sure, then if I confirm that I want to delete, then the poll will be deleted.
 */

test.describe('Delete Poll', async () => {
  let pollId: number | undefined;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.deleteOpenPollCards();
    pollId = await homePage.createPoll();
  });

  test('1-1F-1. Given connected as CO, can delete a pending poll', async ({
    page,
  }) => {
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);

    await expect(pollPage.pollPageStatusChip).toHaveText('Pending', {
      timeout: 10_000,
    });
    await pollPage.deletePoll();

    await expect(page).toHaveURL('/');
  });
  test('1-1F-2. Given connected as CO, can delete a ongoing poll', async ({
    page,
  }) => {
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);

    await expect(pollPage.pollPageStatusChip).toHaveText('Pending', {
      timeout: 10_000,
    });
    await pollPage.beginVoteBtn.click();
    await expect(pollPage.pollPageStatusChip).toHaveText('Voting', {
      timeout: 10_000,
    });
    await pollPage.deletePoll();

    await expect(page).toHaveURL('/');
  });
  test('1-1F-3. Given connected as CO, can delete a closed poll', async ({
    page,
  }) => {
    test.slow();
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);

    await expect(pollPage.pollPageStatusChip).toHaveText('Pending', {
      timeout: 10_000,
    });
    await pollPage.beginVoteBtn.click();
    await expect(pollPage.pollPageStatusChip).toHaveText('Voting', {
      timeout: 10_000,
    });
    await pollPage.closeVoteBtn.click();
    await expect(pollPage.pollPageStatusChip).toHaveText('Concluded', {
      timeout: 10_000,
    });
    await pollPage.deletePoll();

    await expect(page).toHaveURL('/');
  });
});

test.describe('Open Close Poll', () => {
  test.use({
    pollType: 'CreatePoll',
  });
  /**
   * Description: A convention organiser will be able to open a poll to make it available to vote on my delegates and alternates
   *
   * User Stories: As a CO, I want to open a poll, so that those who are eligible to vote can do so.
   *
   * Acceptance Criteria: Given that I am a CO on the poll's page, and the poll is in 'pending' status, then when I click the "open poll" button then the poll is opened.
   */
  test('1-1C. Given connected as CO can open  poll', async ({
    page,
    pollId,
  }) => {
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);

    await pollPage.beginVoteBtn.click();

    await expect(page.getByText('Poll voting is open!')).toBeVisible();
    await expect(pollPage.closeVoteBtn).toBeVisible();
  });
  /**
   * Description: If a poll is open then a CO can close it
   *
   * User Story: As a CO, I want to be able to close a poll so that the results can be calculated
   *
   * Acceptance Criteria: Given that I am a CO on the page of a poll that is in "Open" status, when I click "Close Poll" then the poll is closed.
   */
  test('1-1D. Given connected as CO can close an open poll', async ({
    page,
    pollId,
  }) => {
    test.slow();
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);

    await pollPage.beginVoteBtn.click();
    await expect(pollPage.pollPageStatusChip).toHaveText('Voting', {
      timeout: 10_000,
    });
    await pollPage.closeVoteBtn.click();
    await expect(pollPage.pollPageStatusChip).toHaveText('Concluded', {
      timeout: 10_000,
    });
    await expect(pollPage.downloadVotesBtn).toBeVisible();
  });
  /**
   * Description: Once a poll has been closed to voting it cannot be re-opened, and no further votes will be accepted.
   *
   * User Story: As a CO, I do not want to be able to reopen a poll, so that there is no suggestion of vote manipulation.
   *
   * Acceptance Criteria: Given that I am on the page of a closed poll, then there is no button or any other way for me to re-open it.
   */
  test('1-1E. Given connected as CO cannot re-open closed poll', async ({
    page,
    pollId,
  }) => {
    test.slow();
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);

    await pollPage.beginVoteBtn.click();
    await expect(pollPage.pollPageStatusChip).toHaveText('Voting', {
      timeout: 10_000,
    });
    await pollPage.closeVoteBtn.click();

    await expect(pollPage.downloadVotesBtn).toBeVisible({ timeout: 10_000 });

    expect(await page.locator('button').allInnerTexts()).not.toContain(
      'Begin Voting'
    );
  });
});

test.describe('Create Poll', () => {
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
  test('1-1A. Given connected as CO can see create poll button', async ({
    page,
  }) => {
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
  test('1-1B. Given connected as CO can create a new poll', async ({
    page,
  }) => {
    await page.goto('/');
    const homePage = new HomePage(page);
    const pollName = faker.commerce.productName();
    const pollDescription = faker.commerce.productDescription();
    await homePage.deleteOpenPollCards();
    await homePage.createPoll(pollName, pollDescription);

    await expect(page.getByText(pollName)).toBeVisible();
    await expect(
      page.getByTestId('poll-page-status-chip').getByText('Pending')
    ).toBeVisible();
  });
});

test.describe('User Control', () => {
  test.use({ pollType: 'CreatePoll' });

  /**
   * Description: A CO can update individual fields in the information held on a given user of the CVT
   *
   * User Story: As a CO, I want to be able to edit the information held on an individual, so that I do not have to delete and then re-create their record.
   *
   * Acceptance Criteria: Given that I am a CO on the page containing the list of user records, I can select the
   * record that I want to edit and modify the fields in that record as I see fit.
   */
  test('1-2A. Given connected as CO can update all fields of user', async ({
    page,
    pollId,
  }) => {
    const name = faker.person.fullName();
    const email = name.split(' ')[0] + '@email.com';
    const stake_address = faker.person.jobArea();
    const represntativePage = new RepresentativesPage(page);
    await represntativePage.updateUserProfile(name, email, stake_address);
    await represntativePage.isRepresentativeUpdated([
      name,
      email,
      stake_address,
    ]);
  });

  test('1-2B. Should have corresponding workspace delegate and alternate in a same row', async ({
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

  test('1-2C. Should have workspace_name ordered alphabetically', async ({
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

  test('1-2D. Should not be able to switch active voting power between delegate and alternate when polling is open', async ({
    page,
    pollId,
  }) => {
    test.slow();
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);
    await pollPage.beginVoteBtn.click();

    // before switching power while poll is opened for voting
    const representativePage = new RepresentativesPage(page);
    await representativePage.goto();
    await expect(page.getByRole('row').first()).toBeVisible();
    const previousActiveVoterId = await page
      .locator('[data-id="1"]')
      .locator('[data-field="active_voter_cell"]')
      .getAttribute('data-testid');

    await representativePage.switchVotingPower();
    await page.waitForTimeout(500);

    // // after trying to switch power while poll is opened for voting
    await expect(page.getByRole('status')).toHaveText(
      'You cannot change the active voter while a Poll is actively voting.'
    );
    const currentActiveVoterId = await page
      .locator('[data-id="1"]')
      .locator('[data-field="active_voter_cell"]')
      .getAttribute('data-testid');

    expect(previousActiveVoterId).toBe(currentActiveVoterId);
  });

  test('1-2D. Should not be able to edit user profile when polling is open', async ({
    page,
    pollId,
  }) => {
    test.slow();
    const pollPage = new PollPage(page);
    await pollPage.goto(pollId);
    await pollPage.beginVoteBtn.click();

    // before switching power while poll is opened for voting
    const representativePage = new RepresentativesPage(page);
    await representativePage.goto();
    await expect(page.getByRole('row').first()).toBeVisible();
    const name = faker.person.fullName();
    const email = name.split(' ')[0] + '@email.com';
    const stake_address = faker.person.jobArea();
    await representativePage.updateUserProfile(name, email, stake_address);

    // // after trying to switch power while poll is opened for voting
    await expect(page.getByRole('status')).toHaveText(
      'You cannot update user information while a Poll is actively voting.'
    );
    await expect(page.getByTestId('edit-representative-info-2')).toBeVisible();
    await expect(page.getByText(name)).not.toBeVisible();
  });
});

/**
 * Description: If a delegate is unable to vote then their alternate needs to be given voting rights, and if they become able to vote again, then the voting rights need to be able to be returned.
 *
 * User Story: As a CO, I want to be able to choose either the delegate or the alternate from any given workshop to have the right to vote on behalf of the workshop participants so that every workshop has the opportunity to cast exactly one vote in each poll
 *
 * Acceptance Criteria: Given that I am a CO on the page listing all the delegates and alternates, when I toggle one of them to be the voter from a given workshop that one can vote, the other one from the workshop is not able to vote.
 */

test.describe('Voting Power', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.deleteOpenPollCards();
  });
  test('1-3A. Should be able to switch active voting power between delegate and alternate.', async ({
    page,
  }) => {
    const representativePage = new RepresentativesPage(page);
    await representativePage.goto();
    const previousActiveVoterId = await page
      .locator('[data-id="1"]')
      .locator('[data-field="active_voter_cell"]')
      .getAttribute('data-testid');
    await representativePage.switchVotingPower();

    await expect(page.getByText('Active voter updated!')).toBeVisible();
    const representativesIds = await Promise.all([
      representativePage.getRepresentativeId(true),
      representativePage.getRepresentativeId(),
    ]);
    const currentActiveVoterId = await page
      .locator('[data-id="1"]')
      .locator('[data-field="active_voter_cell"]')
      .getAttribute('data-testid');

    expect(representativesIds).toEqual(
      expect.arrayContaining([currentActiveVoterId, previousActiveVoterId])
    );
    expect(currentActiveVoterId).not.toBe(previousActiveVoterId);
  });
});
