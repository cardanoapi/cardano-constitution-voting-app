import { useEffect, useState } from 'react';
import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import { Box, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import toast from 'react-hot-toast';

import type { Poll, PollVote } from '@/types';
import { getPolls } from '@/lib/helpers/getPolls';
import { getUserVotes } from '@/lib/helpers/getUserVotes';

interface Props {
  userId: string | string[] | undefined;
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

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      // get votes
      const voteData = await getUserVotes(userId);
      if (voteData.votes.length > 0) {
        setVotes(voteData.votes);
      } else if (voteData.message !== 'User votes found') {
        toast.error(voteData.message);
      }
      // get polls
      const polls = await getPolls();
      setPolls(polls);

      setLoading(false);
    }
    if (userId) {
      fetchData();
    }
  }, [userId]);

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
            data-testid={`user-votes-${params.row.id}`}
          >
            {userVote === 'yes' && (
              <ThumbUpRounded
                color="success"
                data-testid={`yes-${params.row.id}`}
              />
            )}
            {userVote === 'no' && (
              <ThumbDownRounded
                color="warning"
                data-testid={`no-${params.row.id}`}
              />
            )}
            {userVote === 'abstain' && (
              <DoDisturbRounded data-testid={`abstain-${params.row.id}`} />
            )}
            {!userVote && (
              <Typography data-testid={`none-${params.row.id}`}>
                None
              </Typography>
            )}
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );
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
        No voting history found.
      </Typography>
    );
  }
}
