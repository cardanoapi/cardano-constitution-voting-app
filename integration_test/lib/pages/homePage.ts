import { expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { extractPollIdFromUrl } from '@helpers/string';

export default class HomePage {
  readonly heading = this.page.getByText(
    'Welcome to the Constitutional Convention Voting Tool'
  );
  // btn
  readonly createPollBtn = this.page.getByTestId('create-poll-button').first();
  readonly submitPollBtn = this.page.getByTestId('create-poll-button'); //BUG incorrect testid

  // input
  readonly pollNameInput = this.page.locator(
    '[data-testid="poll-name-input"] input'
  ); //BUG incorrect position of testid

  readonly pollDescriptionInput = this.page
    .locator('[data-testid="poll-description-input"] textarea')
    .first();

  readonly pollCard = this.page.locator('[data-testid^="poll-card-"]');

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async createPoll(
    pollName = faker.commerce.productName(),
    pollDescription = faker.commerce.productDescription()
  ): Promise<number> {
    await this.createPollBtn.click();
    await this.pollNameInput.fill(pollName);
    await this.pollDescriptionInput.fill(pollDescription);
    await this.submitPollBtn.click();

    await expect(this.page.getByText(pollName)).toBeVisible();

    const currentPageUrl = this.page.url();
    return extractPollIdFromUrl(currentPageUrl);
  }

  async deleteOpenPollCards() {
    await this.page.waitForTimeout(1_000);
    const pollCards = await this.pollCard.all();
    if (pollCards.length > 0) {
      for (const pollCard of pollCards) {
        const pollCardInnerTexts = await pollCard.innerText();
        console.log(pollCardInnerTexts);
        if (
          pollCardInnerTexts.includes('Voting') ||
          pollCardInnerTexts.includes('Pending')
        ) {
          await pollCard.click();
          await this.page.getByTestId('delete-poll-button').click();
        }
      }
    }
  }
}
