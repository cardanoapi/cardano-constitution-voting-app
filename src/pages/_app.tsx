import type { AppProps } from 'next/app';

import Layout from '../../components/layout/Layout';
import ColorModeProvider from '../../providers/themeProvider';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ColorModeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>{' '}
    </ColorModeProvider>
  );
}
