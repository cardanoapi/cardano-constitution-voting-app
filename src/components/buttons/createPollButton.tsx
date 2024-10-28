import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

import { paths } from '@/paths';
import { newPoll } from '@/lib/helpers/newPoll';

interface Props {
  name: string;
  description: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * A button for workshop coordinators to create a new poll
 * @returns Create Poll Button
 */
export function CreatePollButton(props: Props): JSX.Element {
  const { name, description, setName, setDescription } = props;
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
    <Button
      onClick={handleCreatePoll}
      variant="contained"
      disabled={isSubmitting}
    >
      Submit
    </Button>
  );
}
