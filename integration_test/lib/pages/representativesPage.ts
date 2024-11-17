import { Page, expect } from '@playwright/test';

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

  async updateUserProfile(
    name: string,
    email: string,
    stake_address: string
  ): Promise<void> {
    // await this.goto();
    // await this.page
    //   .locator('[data-testid^="edit-representative-info-"]')
    //   .first()
    //   .click();
    // await this.page.getByRole('textbox').nth(0).fill(name);
    // await this.page.getByRole('textbox').nth(1).fill(email);
    // await this.page
    //   .locator('[data-testid^="save-representative-info-"]')
    //   .first()
    //   .click();
    await this.goto();
    await this.updateDelegateBtn.click();
    await this.page.getByRole('textbox').nth(0).fill(name);
    await this.page.getByRole('textbox').nth(1).fill(email);
    await this.page.getByRole('textbox').nth(2).fill(stake_address);
    await this.saveDelegateInfoBtn.click({ force: true });
  }

  async isRepresentativeUpdated(infos: Array<string>): Promise<void> {
    await expect(this.page.getByText(representativeUpdatedToast)).toBeVisible();
    await Promise.all(
      infos.map(
        async (info) => await expect(this.page.getByText(info)).toBeVisible()
      )
    );
  }

  async switchVotingPower(): Promise<void> {
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
    await this.page
      .locator('[data-id="1"]')
      .filter({ has: this.page.getByTestId('edit-active-voter-1') })
      .locator(`[data-testid^="${activeVoterRole.toLowerCase()}-name-"]`)
      .click({ force: true });
    await expect(this.page.locator('.MuiChip-root').first()).toHaveText(
      'Active Voter'
    );
  }

  async getRepresentativeId(isDelegate: boolean = false): Promise<string> {
    await expect(this.page.getByRole('row').first()).toBeVisible();
    const representativeTestId = await this.page
      .locator('[data-id="1"]')
      .filter({ has: this.page.getByTestId('edit-active-voter-1') })
      .locator(
        `[data-testid^="${isDelegate ? 'delegate' : 'alternate'}-name-"]`
      )
      .getAttribute('data-testid');
    return representativeTestId.split('-').pop();
  }
}
