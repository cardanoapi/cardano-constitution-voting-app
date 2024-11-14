import { organizerWallet } from '@constants/staticWallets';
import { setAllureEpic } from '@helpers/allure';
import { expect } from '@playwright/test';
import { test } from '@fixtures/walletExtension';
import RepresentativesPage from '@pages/representativesPage';
import HomePage from '@pages/homePage';
import { faker } from '@faker-js/faker';


test.beforeEach(async () => {
    await setAllureEpic('0. All Users');
});

test.use({ storageState: '.auth/organizer.json', wallet: organizerWallet });


test.describe('Polls', () => {


    /**
     * Description
     * The Convention Voting Tool (CVT) recognises a Convention Organiser (CO)
     *
     * User Story
     * As a CO I want the CVT to know my status so that I can act on it
     *
     * Acceptance Criteria
     * Given that I am a CO with my wallet connected, When I go to the homepage, Then I see the "create poll" button
     */
    test('01A. Given any user, can view all polls', async ({page}) => {
        throw new Error("Not Implemented")
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

