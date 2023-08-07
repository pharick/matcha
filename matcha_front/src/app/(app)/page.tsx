import { NextPage } from 'next';

import Matcha from '@/components/Matcha';
import { getCurrentUser } from '@/api/auth';
import { redirect } from 'next/navigation';

const IndexPage: NextPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return (
    <div className="min-h-screen">
      <Matcha currentUser={currentUser} />
    </div>
  );
};

export default IndexPage;
