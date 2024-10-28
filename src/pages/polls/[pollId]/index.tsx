// import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ViewPoll(): JSX.Element {
  // const [name, setName] = useState('');
  // const [description, setDescription] = useState('');
  const router = useRouter();
  const { pollId } = router.query;

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
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="h4" fontWeight="bold">
            View Poll
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {pollId}
          </Typography>
        </Box>
      </main>
    </>
  );
}
