import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import type { Poll, PollVote } from '@/types';

interface Props {
  votes: PollVote[];
  polls: Poll[];
}

/**
 * A Table with a Representatives vote history in every Poll
 * @param votes - The User's Votes
 * @param polls - The Polls
 * @returns Voting History Table for Each Poll
 */
export function VotingHistoryTable(props: Props): JSX.Element {
  const { votes, polls } = props;

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

  if (polls.length > 0) {
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
