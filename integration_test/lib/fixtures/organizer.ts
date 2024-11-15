import { organizerWallet } from '@constants/staticWallets';
import { test as base } from '@fixtures/walletExtension';
import { createNewPageWithWallet } from '@helpers/page';
import HomePage from '@pages/homePage';
import PollPage from '@pages/pollPage';

type pollEnableType = 'CreatePoll' | 'CreateAndBeginPoll' | 'NoAction';

type TestOptions = {
  pollType: pollEnableType;
};

export const test = base.extend<TestOptions & {pollId: number}>({
  pollType: ['NoAction', { option: true }],

  pollId: async ({ page, browser, pollType }, use) => {
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
    }

    await use(pollId );

    // cleanup
    if (pollType !== 'NoAction') {
      const pollPage = new PollPage(organizerPage);
      await pollPage.goto(pollId);
      await pollPage.deletePoll();
    }
  },
});
