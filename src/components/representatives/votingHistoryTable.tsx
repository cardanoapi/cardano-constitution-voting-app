import { useEffect, useState } from 'react';
import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import type { Poll, PollVote } from '@/types';
import { getPolls } from '@/lib/helpers/getPolls';
import { getUserVotes } from '@/lib/helpers/getUserVotes';

interface Props {
  userId: string;
}

/**
 * A Table with a Representatives vote history in every Poll
 * @returns Voting History Table for Each Poll
 */
export function VotingHistoryTable(props: Props): JSX.Element {
  const { userId } = props;
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<PollVote[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);

  const theme = useTheme();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      // get votes
      const voteData = await getUserVotes(userId);
      if (voteData.votes) {
        setVotes(voteData.votes);
      }
      // get polls
      const polls = await getPolls();
      setPolls(polls);

      setLoading(false);
    }
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#' },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'user_vote',
      headerName: 'User Vote',
      minWidth: 150,
      flex: 1,
      renderCell: (params): JSX.Element => {
        const userVoteData = votes.find(
          (vote) => vote.poll_id === params.row.id,
        );
        const userVote = userVoteData?.vote;
        return (
          <Box
            display="flex"
            flexDirection="row"
            height="100%"
            alignItems="center"
          >
            {userVote === 'yes' && <ThumbUpRounded color="success" />}
            {userVote === 'no' && <ThumbDownRounded color="warning" />}
            {userVote === 'abstain' && <DoDisturbRounded />}
            {!userVote && <Typography>None</Typography>}
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return <></>;
  } else if (polls.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" fontWeight="600">
          Voting History
        </Typography>
        <DataGrid rows={polls} columns={columns} />
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No Representatives found.
      </Typography>
    );
  }
}
