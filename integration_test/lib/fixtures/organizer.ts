import { organizerWallet } from '@constants/staticWallets';
import { test as base } from '@fixtures/walletExtension';
import { createNewPageWithWallet } from '@helpers/page';
import HomePage from '@pages/homePage';
import PollPage from '@pages/pollPage';
type TestOptions = {
  pollEnabled: boolean;
};

export const test = base.extend<TestOptions>({
  pollEnabled: [false, { option: true }],

  page: async ({ page, browser, pollEnabled }, use) => {
    // setup
    const organizerPage = await createNewPageWithWallet(browser, {
      storageState: '.auth/organizer.json',
      wallet: organizerWallet,
    });

    const homePage = new HomePage(organizerPage);
    await homePage.goto();
    let pollId: number;
    if (pollEnabled) {
      await homePage.deleteOpenPollCards();
      pollId = await homePage.createPoll();
    }

    await use(page);

    // cleanup
    if (pollEnabled) {
      const pollPage = new PollPage(organizerPage);
      await pollPage.goto(pollId);
      await pollPage.deletePoll();
    }
  },
});
