import Link from 'next/link';
import Button from '@mui/material/Button';

import { paths } from '@/paths';

/**
 * A button for workshop coordinators to create a new poll
 * @returns Create Poll Button
 */
export function CreatePollButton(): JSX.Element {
  return (
    <Link href={paths.polls.new} passHref>
      <Button variant="contained">Create Poll</Button>
    </Link>
  );
}
