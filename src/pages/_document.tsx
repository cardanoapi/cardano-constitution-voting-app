import { Head, Html, Main, NextScript } from 'next/document';
import CssBaseline from '@mui/material/CssBaseline';

export default function Document(): JSX.Element {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </>
  );
}
