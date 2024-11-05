import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import { Box, TextField, Typography } from '@mui/material';

import { CreatePollButton } from '@/components/buttons/createPollButton';

export default function NewPoll(): JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Consitution Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗳️</text></svg>"
        />
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
            data-testid="poll-name-input"
          />
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
            data-testid="poll-description-input"
          />
          <CreatePollButton
            name={name}
            description={description}
            setName={setName}
            setDescription={setDescription}
          />
        </Box>
      </main>
    </>
  );
}
