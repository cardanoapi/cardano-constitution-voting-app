import {
  alternate1Wallet,
  delegate1Wallet,
  organizer1Wallet,
} from '@constants/staticWallets';
import * as wallets from '@constants/staticWallets';
import { test as setup } from '@fixtures/walletExtension';
import { setAllureEpic, setAllureStory } from '@helpers/allure';
import { createAuth } from '@helpers/auth';

const authConfigurations = [
  {
    wallet: organizer1Wallet,
    authFile: '.auth/organizer1.json',
    role: 'Organizer1',
  },
  {
    wallet: delegate1Wallet,
    authFile: '.auth/delegate1.json',
    role: 'Delegate1',
  },
  {
    wallet: alternate1Wallet,
    authFile: '.auth/alternate1.json',
    role: 'Alternate1',
  },
  {
    wallet: wallets.delegate2Wallet,
    authFile: '.auth/delegate2.json',
    role: 'Delegate2',
  },
  {
    wallet: wallets.alternate2Wallet,
    authFile: '.auth/alternate2.json',
    role: 'Alternate2',
  },
  {
    wallet: wallets.delegate3Wallet,
    authFile: '.auth/delegate3.json',
    role: 'Delegate3',
  },
  {
    wallet: wallets.alternate3Wallet,
    authFile: '.auth/alternate3.json',
    role: 'Alternate3',
  },
];

setup.beforeEach(async () => {
  await setAllureEpic('Setup');
  await setAllureStory('Authentication');
});

authConfigurations.forEach(({ wallet, authFile, role }) => {
  setup(`Create ${role} auth`, async ({ page, context }) => {
    await createAuth({
      page,
      context,
      wallet,
      auth: authFile,
    });
  });
});
