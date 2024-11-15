import { setAllureEpic } from '@helpers/allure';
import { expect } from '@playwright/test';
import { test } from '@fixtures/organizer';



test.beforeEach(async () => {
    await setAllureEpic('0. All Users');
});

test.use({
    pollType: 'CreateAndBeginPoll',
});//

test.describe('Polls', () => {

    /**
     * Description: Anyone can see what stage in its lifecycle a poll is
     *
     * User Story: As an observer, I want to know whether a poll is pending, open or closed, so that I know what to expect
     *
     * Acceptance Criteria: Given that I am looking at a given poll, when I look at it, then I can see its status
     */
    test('01A. Given any user, can view poll status', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('[data-testid^="poll-card-"]');

        let pollCards = page.locator('[data-testid^="poll-card-"]');

        let pollCardCount = await pollCards.count();
        expect(pollCardCount).toBeGreaterThan(0);

        // Check that each poll card has a 'poll-status-chip' with "Concluded" or "Pending"
        for (let i = 0; i < pollCardCount; i++) {
            const statusChip = pollCards.nth(i).locator('[data-testid="poll-status-chip"]');

            await expect(statusChip).toBeVisible();

            const statusText = await statusChip.textContent();
            expect(['Concluded', 'Pending','Voting']).toContain(statusText);
        }

        const randomIndex = Math.floor(Math.random() * pollCardCount);
        const pollCard =  pollCards.nth(randomIndex)
        const pollCardTestId = await pollCard.getAttribute('data-testid');
        const pollId = pollCardTestId.split('-').pop();

        await page.goto(`/polls/${pollId}`);


        const pollPageStatusChip = page.getByTestId('poll-page-status-chip');
        await expect(pollPageStatusChip).toBeVisible();

        const statusText = await pollPageStatusChip.textContent();
        expect(['Concluded', 'Pending','Voting']).toContain(statusText);

    });

    test('01B. Given any user, can view poll status', async ({page}) => {
        throw new Error("Not Implemented")
    });
    /**
     * Description: After a poll is closed the results of the poll should be displayed*
     *
     * User Story:
     * As an observer I want to know:
     *
     * How many yes, no & abstain votes there were
     * How many people didn't vote
     * The result
     * Who voted for what
     * ... when a poll is closed, so that I know the outcome
     *
     * Acceptance Criteria: Given that I am observing an open poll, when the poll is closed by a CO, then the results are displayed to me
     *
     * *results of a poll should never be displayed before the close of a poll
     */
    test('01C. Given any user, can view poll results', async ({page}) => {
        throw new Error("Not Implemented")
    });

    /**
     * Description: By going to the profile page of a delegate or alternate I can review their voting record
     *
     * User Story: As an observer I want to know how a given delegate or alternate has voted, so that I can examine their record
     *
     * Acceptance Criteria 1: Given that I am on the page listing delegates and alternates, when I press on a given delegate or alternate, then I will go to their profile page and see their voting record
     *
     * Acceptance Criteria 2: Given that I am on the results page of a closed poll, when I press on the tile of a given voter, then I am taken to their profile page and can see their voting record
     */

})

test.describe('User profile', () => {
    /**
     * Description: By going to the profile page of a delegate or alternate I can review their voting record
     *
     * User Story: As an observer I want to know how a given delegate or alternate has voted, so that I can examine their record
     *
     * Acceptance Criteria 1: Given that I am on the page listing delegates and alternates, when I press on a given delegate or alternate, then I will go to their profile page and see their voting record
     *
     * Acceptance Criteria 2: Given that I am on the results page of a closed poll, when I press on the tile of a given voter, then I am taken to their profile page and can see their voting record
     */
    test('02A-1. Given Delegate or alternate profile page, can view voting hsitory', async ({page}) => {
        throw new Error("Not Implemented")
    });
    test('02A-1. Can navigate to user profile from delegate/alternate listing page', async ({page}) => {
        throw new Error("Not Implemented")
    });
    test('02A-1. Can navigate to user profile from voter view in poll results page', async ({page}) => {
        throw new Error("Not Implemented")
    });

})

