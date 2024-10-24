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

  async function handleCreatePoll(): Promise<void> {
    const newPoll = await fetch('/api/newPoll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New Poll',
        description: 'This is a new poll',
      }),
    });
    const data = await newPoll.json();
    console.log(data);
  }

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
        <Button onClick={handleCreatePoll} variant="contained">
          Create Poll
        </Button>
      </main>
    </>
  );
}
