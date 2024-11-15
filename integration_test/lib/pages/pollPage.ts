import { Page } from '@playwright/test';

export default class PollPage {
  readonly createPollBtn = this.page.getByTestId('create-poll-button');
  readonly beginVoteBtn = this.page.getByTestId('begin-vote-button');
  readonly deletePollBtn = this.page.getByTestId('DeleteRoundedIcon');
  readonly voteYesBtn = this.page.getByTestId('vote-yes-button');
  readonly voteNoBtn = this.page.getByTestId('vote-no-button');
  readonly voteAbstainBtn = this.page.getByTestId('vote-abstain-button');

  constructor(private readonly page: Page) {}

  async goto(pollId: number): Promise<void> {
    this.page.goto(`/polls/${pollId}`);
  }

  async deletePoll(): Promise<void> {
    await this.deletePollBtn.click();
  }
}
