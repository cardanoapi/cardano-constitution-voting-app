import { Page, expect } from '@playwright/test';

export default class PollPage {
  readonly createPollBtn = this.page.getByTestId('create-poll-button');

  constructor(private readonly page: Page) {}

  async goto() {
    this.page.goto('/polls/new');
  }

  async createPoll(): Promise<void> {
    await this.goto();
    expect(this.page.getByText('Submit')).toBeVisible();
    await this.createPollBtn.click({ force: true });
  }

  async deletePoll(): Promise<void> {}
}
