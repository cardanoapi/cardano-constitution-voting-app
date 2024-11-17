import { delegateWallet, organizerWallet } from '@constants/staticWallets';
import { test as base } from '@fixtures/walletExtension';
import {
  createNewPageWithWallet,
  newDelegate2Page,
  newDelegate3Page,
} from '@helpers/page';
import HomePage from '@pages/homePage';
import PollPage from '@pages/pollPage';
import { expect } from '@playwright/test';

type pollEnableType =
  | 'CreatePoll'
  | 'CreateAndBeginPoll'
  | 'NoAction'
  | 'VotedPoll';

type TestOptions = {
  pollType: pollEnableType;
};

export const test = base.extend<TestOptions & { pollId: number }>({
  pollType: ['NoAction', { option: true }],

  pollId: async ({ browser, pollType }, use) => {
    // setup
    const organizerPage = await createNewPageWithWallet(browser, {
      storageState: '.auth/organizer.json',
      wallet: organizerWallet,
    });

    const homePage = new HomePage(organizerPage);
    await homePage.goto();

    let pollId: number | undefined;

    if (pollType !== 'NoAction') {
      await homePage.deleteOpenPollCards();
      pollId = await homePage.createPoll();

      if (pollType === 'CreateAndBeginPoll') {
        await homePage.beginVoteBtn.click();
      }
      if (pollType === 'VotedPoll') {
        await homePage.beginVoteBtn.click();

        const delegatePage = await createNewPageWithWallet(browser, {
          storageState: '.auth/delegate.json',
          wallet: delegateWallet,
        });
        const delegate2Page = await newDelegate2Page(browser);
        const delegate3Page = await newDelegate3Page(browser);

        const votes = [
          'vote-yes-button',
          'vote-no-button',
          'vote-abstain-button',
        ];

        await Promise.all(
          [delegatePage, delegate2Page, delegate3Page].map(
            async (userPage, index) => {
              const userPollPage = new PollPage(userPage);
              await userPollPage.goto(pollId);
              // cast vote
              await userPage.getByTestId(votes[index]).click();
            }
          )
        );
        const pollPage = new PollPage(organizerPage);
        await pollPage.goto(pollId);
        await pollPage.endVoting();
      }
    }

    await use(pollId);

    // cleanup
    if (pollType !== 'NoAction') {
      const pollPage = new PollPage(organizerPage);
      await pollPage.goto(pollId);
      // await pollPage.deletePoll();
    }
  },
});
