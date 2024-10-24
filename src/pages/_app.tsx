import type { AppProps } from 'next/app';
import { ColorModeProvider } from '@/providers/themeProvider';
import { SessionProvider } from 'next-auth/react';

import { Layout } from '@/components/layout/layout';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SessionProvider>
      <ColorModeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ColorModeProvider>
    </SessionProvider>
  );
}
