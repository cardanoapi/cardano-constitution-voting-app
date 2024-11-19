import { allure } from 'allure-playwright';
import { isMobile, isTablet } from './device';
import { chromium } from '@playwright/test';

export const setAllureEpic = async (groupName: string): Promise<void> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  if (isMobile(page)) {
    await allure.epic('5. Miscellaneous');
    await allure.feature('5A. Should be accessible from mobile');
    await allure.story(groupName);
  } else if (isTablet(page)) {
    await allure.epic('5. Miscellaneous');
    await allure.feature('5B. Should be accessible from tablet');
    await allure.story(groupName);
  } else {
    await allure.epic(groupName);
  }
};

export const setAllureStory = async (groupName: string): Promise<void> => {
  await allure.story(groupName);
};
