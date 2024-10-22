import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    user: DefaultUser & {
      stakeAddress: string;
      walletName: string;
    };
  }

  interface User {
    stakeAddress: string;
    walletName: string;
  }
}
