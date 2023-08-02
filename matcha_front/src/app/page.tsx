import { NextPage } from 'next';
import { redirect } from 'next/navigation';

import Header from '@/components/header/Header';
import { getCurrentUser } from '@/api/auth';
import Matcha from '@/components/Matcha';

const IndexPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <Matcha />
    </div>
  );
};

export default IndexPage;
