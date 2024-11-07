import Head from 'next/head';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { ManageActivePowerTable } from '@/components/coordinator/manageActivePowerTable';
import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

export default function ManageRepresentatives(): JSX.Element {
  return (
    <>
      <Head>
        <title>Constitutional Convention Voting App</title>
        <meta
          name="description"
          content="Voting app to be used by delegates at the Cardano Constitutional Convention in Buenos Aires to ratify the initial constitution. This voting app was commissioned by Intersect."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box display="flex" flexDirection="column" gap={6}>
          <Typography variant="h3" fontWeight="bold">
            Coordinator Dashboard
          </Typography>

          <ManageRepresentativesTable />

          <ManageActivePowerTable />
        </Box>
      </main>
    </>
  );
}