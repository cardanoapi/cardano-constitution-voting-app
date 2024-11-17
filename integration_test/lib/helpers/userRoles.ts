import {
  newAlternate2Page,
  newDelegatePage,
  newOrganizerPage,
} from '@helpers/page';

import { Page } from '@playwright/test';

type UserRole =
  | 'Delegate'
  | 'Alternate'
  | 'Organizer'
  | 'Anonymous'
  | 'Voter'
  | 'All';

export function getUserPages(browser, userRole?: UserRole): Promise<Page[]> {
  // setup
  let users: Promise<Page>[] = [];
  if (userRole == 'Delegate') {
    users.push(newOrganizerPage(browser));
  } else if (userRole == 'Alternate') {
    users.push(newOrganizerPage(browser));
  } else if (userRole == 'Organizer') {
    users.push(newOrganizerPage(browser));
  } else if (userRole == 'All' || userRole == undefined) {
    users = [
      newOrganizerPage(browser),
      newAlternate2Page(browser),
      newDelegatePage(browser),
      browser.newPage(),
    ];
  }
  return Promise.all(users);
}

export function forEachUser(
  handler: (user: {
    role: string;
    loader: (browser: unknown) => Promise<Page>;
  }) => unknown
) {
  const users: {
    role: string;
    handler: (browser: unknown) => Promise<Page>;
  }[] = [
    {
      role: 'Alternate',
      handler: (browser) => newAlternate2Page(browser),
    },
    {
      role: 'Delegate',
      handler: (browser) => newAlternate2Page(browser),
    },
    {
      role: 'Organizer',
      handler: (browser) => newAlternate2Page(browser),
    },
    {
      role: 'Anonymous',
      handler: (browser) => browser.newPage(),
    },
  ];
  users.forEach((u) => {
    handler({
      role: u.role,
      loader: (browser) => {
        return u.handler(browser);
      },
    });
  });
}
