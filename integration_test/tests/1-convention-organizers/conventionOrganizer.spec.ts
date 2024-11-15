import { organizerWallet } from '@constants/staticWallets';
import { setAllureEpic } from '@helpers/allure';
import { expect } from '@playwright/test';
import { test } from '@fixtures/walletExtension';
import RepresentativesPage from '@pages/representativesPage';
import HomePage from '@pages/homePage';
import { faker } from '@faker-js/faker';

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
  test('11A. Given connected as CO can see create poll button', async ({
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
  test('11B. Given connected as CO can create a new poll', async ({
    page,
    browser,
  }) => {
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
  test('11C. Given connected as CO can open  poll', async ({
    page,
    browser,
  }) => {
    test.slow();
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.deleteOpenPollCards();

    await homePage.createPoll();
    await page.getByTestId('begin-vote-button').click();

    await expect(page.getByText('Poll voting is open!')).toBeVisible();
    await expect(page.getByTestId('end-vote-button')).toBeVisible();
  });
  /**
   * Description: If a poll is open then a CO can close it
   *
   * User Story: As a CO, I want to be able to close a poll so that the results can be calculated
   *
   * Acceptance Criteria: Given that I am a CO on the page of a poll that is in "Open" status, when I click "Close Poll" then the poll is closed.
   */
  test('11D. Given connected as CO can close an open poll', async ({
    page,
    browser,
  }) => {
    await page.goto('/');
    const votingPollCard = page
      .getByTestId('poll-status-chip')
      .getByText('Voting', { exact: true });
    await votingPollCard.click();
    await page.getByTestId('end-vote-button').click();
    await expect(page.getByTestId('results-yes')).toBeVisible();
  });
  /**
   * Description: Once a poll has been closed to voting it cannot be re-opened, and no further votes will be accepted.
   *
   * User Story: As a CO, I do not want to be able to reopen a poll, so that there is no suggestion of vote manipulation.
   *
   * Acceptance Criteria: Given that I am on the page of a closed poll, then there is no button or any other way for me to re-open it.
   */
  test('11E. Given connected as CO cannot re-open closed poll', async ({
    page,
    browser,
  }) => {
    throw new Error('Not Implemented');
  });

  /**
   * Description: Convention Organisers can delete a poll, so that it no longer appears on the list of historical polls
   *
   * User Story: As a CO I want to be able to delete a poll so that no user of the CVT will be able to see the results of old tests or mistakenly created polls.
   *
   * Acceptance Criteria: Given that I am a CO on the page of a given poll, when I press the delete button I will be asked in a modal if I am sure, then if I confirm that I want to delete, then the poll will be deleted.
   */
  test('11F. Given connected as CO, can delete a poll', async ({
    page,
    browser,
  }) => {
    throw new Error('Not Implemented');
  });
});

test.describe('User Control', () => {
  /**
   * Description: A CO can update individual fields in the information held on a given user of the CVT
   *
   * User Story: As a CO, I want to be able to edit the information held on an individual, so that I do not have to delete and then re-create their record.
   *
   * Acceptance Criteria: Given that I am a CO on the page containing the list of user records, I can select the
   * record that I want to edit and modify the fields in that record as I see fit.
   */
  test('12A. Given connected as CO can update all fields of user', async ({
    page,
    browser,
  }) => {
    throw new Error('Not Implemented');
  });

  /**
   * Description: If a delegate is unable to vote then their alternate needs to be given voting rights, and if they become able to vote again, then the voting rights need to be able to be returned.
   *
   * User Story: As a CO, I want to be able to choose either the delegate or the alternate from any given workshop to have the right to vote on behalf of the workshop participants so that every workshop has the opportunity to cast exactly one vote in each poll
   *
   * Acceptance Criteria: Given that I am a CO on the page listing all the delegates and alternates, when I toggle one of them to be the voter from a given workshop that one can vote, the other one from the workshop is not able to vote.
   */
  test('12B. Given connected as CO can switch delegate user to alternate or vice-versa', async ({
    page,
  }) => {
    const representativePage = new RepresentativesPage(page);
    await representativePage.switchVotingPower();
    await expect(page.getByText('Active voter updated!')).toBeVisible();
    // TODO: go to listing page and confirm that the role is change.
    // again switch and test.
  });

  test('12B. Should have corresponding workspace delegate and alternate in a same row', async ({
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
  test('1-Org-Invite: 9. Convention organisers can update delegate profile information ', async ({
    page,
  }) => {
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
