import { Page } from '@playwright/test';

export default class PollPage {
  //btn
  readonly createPollBtn = this.page.getByTestId('create-poll-button');
  readonly beginVoteBtn = this.page.getByTestId('begin-vote-button');
  readonly closeVoteBtn = this.page.getByTestId('end-vote-button');
  readonly closeVoteConfirmBtn = this.page.getByTestId('end-vote-confirm-button');

  readonly deletePollBtn = this.page.getByTestId('DeleteRoundedIcon');
  readonly voteYesBtn = this.page.getByTestId('vote-yes-button');
  readonly voteNoBtn = this.page.getByTestId('vote-no-button');
  readonly voteAbstainBtn = this.page.getByTestId('vote-abstain-button');
  readonly endVotingBtn = this.closeVoteBtn
  readonly uploadVoteOnchainBtn=this.page.getByTestId('put-votes-onchain-button')
  readonly downloadVotesBtn = this.page.getByTestId('download-poll-votes-btn');

  //chip or icon
  readonly pollPageStatusChip = this.page.getByTestId('poll-page-status-chip');
  readonly voteYesIcon = this.page.getByTestId('ThumbUpOutlinedIcon');

  constructor(private readonly page: Page) {}

  async goto(pollId: number): Promise<void> {
    this.page.goto(`/polls/${pollId}`);
  }

  async deletePoll(): Promise<void> {
    await this.deletePollBtn.click();
  }
  async endVoting() {
    await this.endVotingBtn.click();
    await this.closeVoteConfirmBtn.click()
  }
}
