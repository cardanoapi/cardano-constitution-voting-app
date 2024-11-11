export interface Poll {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'voting' | 'concluded';
  summary_tx_id: string | null;
}

export interface User {
  id: string;
  is_convention_organizer: boolean;
  is_delegate: boolean;
  is_alternate: boolean;
  workshop_id: string;
  name: string;
  email: string;
  wallet_address: string;
}

export interface Workshop {
  id: string;
  name: string;
  delegate_id: string | null;
  alternate_id: string | null;
  active_voter_id: string | null;
}

export interface PollVote {
  poll_id: string;
  user_id: string;
  vote: string;
  signature: string;
  hashed_message: string;
  poll_transaction_id: string | null;
}
