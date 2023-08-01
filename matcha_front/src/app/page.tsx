import { NextPage } from 'next';
import { redirect } from 'next/navigation';

import Header from '@/components/header/Header';
import { getCurrentUser } from '@/api/auth';

const IndexPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <>
      <Header user={user} />
    </>
  );
};

export default IndexPage;
