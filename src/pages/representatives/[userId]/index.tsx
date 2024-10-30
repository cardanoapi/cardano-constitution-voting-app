import { ChangeEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { HowToVoteRounded } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';

import { PollVote, User } from '@/types';
import { getUser } from '@/lib/helpers/getUser';
import { getUserVotes } from '@/lib/helpers/getUserVotes';
import { getWorkshopName } from '@/lib/helpers/getWorkshopName';

export default function Representative(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [workshopName, setWorkshopName] = useState('');
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingWorkshop, setLoadingWorkshop] = useState(false);
  const [loadingVotes, setLoadingVotes] = useState(true);

  const router = useRouter();
  const { userId } = router.query;
  const theme = useTheme();

  useEffect(() => {
    // looks up a user & their vote history in the DB from their userId
    async function fetchUserData(): Promise<void> {
      // get user data
      setLoadingUser(true);
      const user = await getUser(userId as string);
      if (user) {
        setUser(user);
      }
      setLoadingUser(false);

      // get vote data
      setLoadingVotes(true);
      const votes = await getUserVotes(userId as string);
      if (votes) {
        setUser(user);
      }
      setLoadingVotes(false);
    }
    fetchUserData();
  }, [userId]);

  // get the name of the workshop they attended
  useEffect(() => {
    async function fetchWorkshop(): Promise<void> {
      if (user) {
        // get user data
        setLoadingWorkshop(true);
        const workshopName = await getWorkshopName(user.workshop_id.toString());
        if (workshopName) {
          setWorkshopName(workshopName);
        }
        setLoadingWorkshop(false);
      }
    }
    fetchWorkshop();
  }, [user]);

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
        {user ? (
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h3" fontWeight="bold">
              {user.name}
            </Typography>
            {user.is_delegate && (
              <Typography variant="h4" fontWeight="600">
                DELEGATE
              </Typography>
            )}
            {user.is_alternate && (
              <Typography variant="h4" fontWeight="600">
                ALTERNATE
              </Typography>
            )}
            {votes && (
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                alignItems="center"
                color={theme.palette.text.primary}
              >
                <HowToVoteRounded />
                <Typography variant="h5" fontWeight="500">
                  {votes.length} vote{votes.length === 1 ? '' : 's'}
                </Typography>
              </Box>
            )}
            {workshopName && (
              <Typography variant="h5" fontWeight="500">
                {workshopName}
              </Typography>
            )}
          </Box>
        ) : (
          <></>
        )}
      </main>
    </>
  );
}
