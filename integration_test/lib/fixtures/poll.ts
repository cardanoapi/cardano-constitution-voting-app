import { organizerWallets } from '@constants/staticWallets';
import { test as base } from '@fixtures/walletExtension';
import {
  createNewPageWithWallet,
  newDelegate2Page,
  newDelegate3Page,
  newDelegate1Page,
} from '@helpers/page';
import HomePage from '@pages/homePage';
import PollPage from '@pages/pollPage';
import { Page } from '@playwright/test';

type pollEnableType =
  | 'CreatePoll'
  | 'CreateAndBeginPoll'
  | 'NoAction'
  | 'VotedPoll'
  | 'CreatePollWithoutTeardown';

type TestOptions = {
  pollType: pollEnableType;
};

export const test = base.extend<TestOptions & { pollId: number }>({
  pollType: ['NoAction', { option: true }],

  pollId: async ({ browser, pollType }, use) => {
    // setup
    const organizerPage = await createNewPageWithWallet(browser, {
      storageState: '.auth/organizer1.json',
      wallet: organizerWallets[0],
    });

    let pages: Page[] = [];
    const homePage = new HomePage(organizerPage);
    await homePage.goto();
    const organizerPollPage = new PollPage(organizerPage);

    let pollId: number | undefined;

    if (pollType !== 'NoAction') {
      await homePage.deleteOpenPollCards();
      pollId = await homePage.createPoll();

      if (pollType === 'CreateAndBeginPoll') {
        await homePage.beginVoteBtn.click();
      }
      if (pollType === 'VotedPoll') {
        await homePage.beginVoteBtn.click();

        const delegatePage = await newDelegate1Page(browser);
        const delegate2Page = await newDelegate2Page(browser);
        const delegate3Page = await newDelegate3Page(browser);

        const votes = [
          'vote-yes-button',
          'vote-no-button',
          'vote-abstain-button',
        ];
        pages = [delegatePage, delegate2Page, delegate3Page];

        await Promise.all(
          pages.map(async (userPage, index) => {
            const userPollPage = new PollPage(userPage);
            await userPollPage.goto(pollId);
            // cast vote
            await userPage.getByTestId(votes[index]).click();
            await userPage.getByText('Vote recorded').isVisible();
            // await userPage.close();
          })
        );
        await organizerPollPage.goto(pollId);
        await organizerPollPage.endVoting();
      }
    }

    await use(pollId);

    await Promise.all(
      pages.map(async (userPage) => {
        userPage.close();
      })
    );
    // cleanup
    if (pollType !== 'NoAction' && pollType !== 'CreatePollWithoutTeardown') {
      await organizerPollPage.deletePoll();
    }
  },
});
