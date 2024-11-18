import { allure } from 'allure-playwright';
import { isMobile } from './mobile';
import { chromium } from '@playwright/test';

export const setAllureEpic = async (groupName: string): Promise<void> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  if (isMobile(page)) {
    await allure.epic('5. Miscellaneous');
    await allure.story('5A. Should be accessible from mobile');
  } else {
    await allure.epic(groupName);
  }
};

export const setAllureStory = async (groupName: string): Promise<void> => {
  await allure.story(groupName);
};
