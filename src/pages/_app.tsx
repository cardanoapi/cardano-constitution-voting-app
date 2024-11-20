import type { AppProps } from 'next/app';
import { WalletContextProvider } from '@/context/WalletContext';
import { ReactQueryProvider } from '@/providers/reactQueryProvider';
import { ColorModeProvider } from '@/providers/themeProvider';
import { SessionProvider } from 'next-auth/react';

import { Layout } from '@/components/layout/layout';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ColorModeProvider>
          <WalletContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletContextProvider>
        </ColorModeProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
