import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from '@/paths';
import { RepresentativesTable } from '@/components/representatives/representativesTable';

export default function Home(): JSX.Element {
  const router = useRouter();
  const { tab } = router.query;
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(Number(tab));
  }, [tab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push({
      pathname: paths.browse,
      query: {
        tab: newValue.toString(),
      },
    });
  };

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

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
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: { display: 'none' },
          }}
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            label="Polls"
            {...a11yProps(0)}
            sx={{
              mx: 2,
              py: 2,
            }}
          />
          <Tab
            label="Representatives"
            {...a11yProps(1)}
            sx={{
              mx: 2,
              py: 2,
            }}
          />
        </Tabs>
        {value === 0 ? <></> : <RepresentativesTable />}
      </main>
    </>
  );
}
