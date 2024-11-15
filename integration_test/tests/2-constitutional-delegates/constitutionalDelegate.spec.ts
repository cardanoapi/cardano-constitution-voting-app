import { setAllureEpic } from '@helpers/allure';
import { test } from '@fixtures/organizer';
import { delegateWallet } from '@constants/staticWallets';
import PollPage from '@pages/pollPage';
import { expect } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('2. Constitutional Delegates');
});

test.use({
  storageState: '.auth/delegate.json',
  wallet: delegateWallet,
});

test.describe('Vote', () => {
  test.describe('  poll', () => {
    test.use({
      pollType: 'CreateAndBeginPoll',
    });
    /**
     * Description: voters are the only people who can vote, and they can only vote in a poll that is open
     *
     * User Story: As an eligible delegate or alternate, I want to be able to vote in open polls, so that I can represent the interests of my workshop
     *
     * Acceptance Criteria: Given that I am on the page of an open poll when I look at it, then I see that I have the option to vote*
     *
     * *conversely votes that are 'closed' or 'pending' do not give voters the option to vote.
     */
    test('21A. Given active delegate, and poll is open, can cast vote', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);

      await expect(pollPage.voteYesBtn).toBeVisible();
      await expect(pollPage.voteNoBtn).toBeVisible();
      await expect(pollPage.voteAbstainBtn).toBeVisible();
    });

    /**
     * Description: If a voter has already voted on a poll that is currently open then they will be able to change their vote
     *
     * User Story: As a voter, I want to be able to change my vote before the poll is closed, so that I can be sure that I made the right choice
     *
     * Acceptance Criteria: Given that I am a voter on the page of an open poll and I have already voted, when I vote again, then my vote is counted.
     */
    test('21C. Given active delegate, and poll is open, can update casted vote', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);
      //  yes vote
      await pollPage.voteYesBtn.click();
      await expect(page.getByText('Yes', { exact: true })).toBeVisible();

      // change vote
      await pollPage.voteNoBtn.click();

      await expect(page.getByText('No', { exact: true })).toBeVisible();
    });

    /**
     * Description: voters can choose not to vote
     *
     * User Story: As a voter I want to be able to choose not to vote, so that the app does not break if I don't
     * .
     * Acceptance Criteria: Given that I am a voter, when I choose not to vote, then there is no effect.
     */

    test('21D. Given active delegate, can choose not to vote', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);
      await pollPage.voteAbstainBtn.click();

      await expect(page.getByText('Abstain', { exact: true })).toBeVisible();
    });
  });

  test.describe('Pending poll', () => {
    test.use({
      pollType: 'CreatePoll',
    });

    /**
     * Description: voters are the only people who can vote, and they can only vote in a poll that is open
     *
     * User Story: As an eligible delegate or alternate, I want to be able to vote in open polls, so that I can represent the interests of my workshop
     *
     * Acceptance Criteria: Given that I am on the page of an open poll when I look at it, then I see that I have the option to vote*
     *
     * *conversely votes that are 'closed' or 'pending' do not give voters the option to vote.
     */

    test('21B. Given active delegate and the poll is pending, voting should be disallowed', async ({
      page,
      pollId,
    }) => {
      const pollPage = new PollPage(page);
      await pollPage.goto(pollId);

      await expect(pollPage.voteYesBtn).not.toBeVisible();
      await expect(pollPage.voteNoBtn).not.toBeVisible();
      await expect(pollPage.voteAbstainBtn).not.toBeVisible();
    });
  });
});
