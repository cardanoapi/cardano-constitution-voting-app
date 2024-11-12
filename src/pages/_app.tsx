import type { AppProps } from 'next/app';
import { ReactQueryProvider } from '@/providers/reactQueryProvider';
import { ColorModeProvider } from '@/providers/themeProvider';
import { SessionProvider } from 'next-auth/react';

import { Layout } from '@/components/layout/layout';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ColorModeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ColorModeProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
