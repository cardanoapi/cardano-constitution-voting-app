import { Head, Html, Main, NextScript } from 'next/document';
import CssBaseline from '@mui/material/CssBaseline';

export default function Document(): JSX.Element {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Html lang="en">
        <Head>
          <script
            type="text/javascript"
            src="/cardano-dapp-connector-bridge.min.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </>
  );
}
