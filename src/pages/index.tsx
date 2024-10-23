import { useEffect, useState } from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';

export default function Home(): JSX.Element {
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/getUser', { headers: { 'X-Custom-Header': 'intersect' } })
      .then((res) => res.json())
      .then((data) => setName(data.user));
  }, []);

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Consitution Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Home</h1>
        <h2>{name}</h2>
        <Button variant="contained">Hello world</Button>
      </main>
      <footer>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org →
        </a>
      </footer>
    </>
  );
}
