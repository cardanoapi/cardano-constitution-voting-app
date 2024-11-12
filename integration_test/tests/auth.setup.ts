import {
  alternateWallet,
  delegateWallet,
  organizerWallet,
} from '@constants/staticWallets';
import { test as setup } from '@fixtures/walletExtension';
import { setAllureEpic, setAllureStory } from '@helpers/allure';
import { createAuth } from '@helpers/auth';

const organizerAuthFile = '.auth/organizer.json';
const delegateAuthFile = '.auth/delegate.json';
const alternateAuthFile = '.auth/organizer.json';

setup.beforeEach(async () => {
  await setAllureEpic('Setup');
  await setAllureStory('Authentication');
});

setup('Create organizer auth', async ({ page, context }) => {
  await createAuth({
    page,
    context,
    wallet: organizerWallet,
    auth: organizerAuthFile,
  });
});

setup('Create delegate auth', async ({ page, context }) => {
  await createAuth({
    page,
    context,
    wallet: delegateWallet,
    auth: delegateAuthFile,
  });
});

setup('Create alternate auth', async ({ page, context }) => {
  await createAuth({
    page,
    context,
    wallet: alternateWallet,
    auth: alternateAuthFile,
  });
});
