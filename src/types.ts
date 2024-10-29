export interface Poll {
  id: string;
  name: string;
  description: string;
  status: string;
  summary_tx_id?: string;
}

export interface User {
  id: string;
  is_convention_organizer: boolean;
  is_delegate: boolean;
  is_alternate: boolean;
  workshop_id: string;
  name: string;
  email: string;
  color: string;
  wallet_address: string;
}
