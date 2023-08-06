import { NextPage } from 'next';

import Header from '@/components/header/Header';
import { getCurrentUser } from '@/api/auth';
import Matcha from '@/components/Matcha';

const IndexPage: NextPage = () => {
  const currentUserPromise = getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentUserPromise={currentUserPromise} />
      <Matcha />
    </div>
  );
};

export default IndexPage;
