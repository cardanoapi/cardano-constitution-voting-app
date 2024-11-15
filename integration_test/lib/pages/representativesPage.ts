import { Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const updateDelegateEmail = faker.person.fullName + '@email.com';
const updatedAlternateEmail = faker.person.fullName + '@email.com';
const representativeUpdatedToast = 'User info updated!';
export default class RepresentativesPage {
  readonly updateDelegateBtn = this.page.getByTestId(
    'edit-representative-info-2'
  );
  readonly saveDelegateInfoBtn = this.page.getByTestId(
    'save-representative-info-2'
  );
  readonly updateAlternateBtn = this.page.getByTestId(
    'edit-representative-info-3'
  );
  readonly saveAlternateBtn = this.page.getByTestId(
    'save-representative-info-3'
  );
  readonly transferVotingPowerBtn = this.page.getByTestId(
    'edit-active-voter-1'
  );
  readonly saveUpdatedVotingPowerBtn = this.page.getByTestId(
    'save-active-voter-1'
  );

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/representatives/manage');
  }

  async updateDelegateProfile(): Promise<void> {
    await this.goto();
    await this.updateDelegateBtn.click();
    await this.page.getByRole('textbox').nth(1).fill(updateDelegateEmail);
    await this.saveDelegateInfoBtn.click({ force: true });
  }

  async isRepresentativeUpdated(): Promise<void> {
    await expect(this.page.getByText(representativeUpdatedToast)).toBeVisible();
  }

  async updateAlternateProfile(): Promise<void> {
    await this.goto();
    await this.updateAlternateBtn.click();
    await this.page.getByRole('textbox').nth(1).fill(updatedAlternateEmail);
    await this.saveAlternateBtn.click({ force: true });
  }

  async switchVotingPower(): Promise<void> {
    await this.goto();
    await this.transferVotingPowerBtn.click();
    const currentActiveVoter = await this.page
      .getByRole('combobox')
      .nth(1)
      .innerText();
    await this.page.getByRole('combobox').nth(1).click();
    await this.page
      .getByRole('option', {
        name: currentActiveVoter === 'Delegate' ? 'Alternate' : 'Delegate',
      })
      .click({ force: true });
    await this.saveUpdatedVotingPowerBtn.click();
  }

  async assertSwitchedVotingPower(): Promise<void> {
    await expect(this.page.getByRole('row').first()).toBeVisible();
    const activeVoterRole = await this.page
      .locator('[data-id="1"]')
      .locator('[data-field="active_voter_id"]')
      .innerText();
    const changedRow = await this.page
      .locator('[data-id="1"]')
      .filter({ has: this.page.getByTestId('edit-active-voter-1') })
      .allInnerTexts();
    const changedRowData = changedRow[0].split('\n\n');
    const activeVoter =
      activeVoterRole === 'Delegate' ? changedRowData[1] : changedRowData[2];
    await this.page.goto('/');
    const activeVoterNamme = await this.page
      .locator('[data-id="1"]')
      .locator('[data-field="active_voter"]')
      .innerText();
    expect(activeVoterNamme).toBe(activeVoter);
  }
}
