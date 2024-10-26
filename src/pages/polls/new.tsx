import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { paths } from '@/paths';
import { newPoll } from '@/lib/helpers/newPoll';

export default function NewPoll(): JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // call new poll api with this name & description
  async function handleCreatePoll(): Promise<void> {
    setIsSubmitting(true);
    const newPollId = await newPoll(name, description);
    setIsSubmitting(false);

    if (newPollId !== '-1') {
      // successful creation, clear form & redirect to poll
      setName('');
      setDescription('');
      router.push(paths.polls.poll + newPollId);
    }
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
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="h4" fontWeight="bold">
            Create a new poll
          </Typography>
          <TextField
            variant="filled"
            type="text"
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setName(event.target.value);
            }}
            label="Name"
            value={name}
          ></TextField>
          <TextField
            variant="filled"
            type="text"
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setDescription(event.target.value);
            }}
            label="Description"
            value={description}
            multiline={true}
            rows={4}
          ></TextField>
          <Button
            onClick={handleCreatePoll}
            variant="contained"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Box>
      </main>
    </>
  );
}
