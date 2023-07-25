import Header from '@/components/Header';
import { withLogin } from '@/helpers';

import { Metadata, NextPage } from 'next';
import UserProfile from './components/UserProfile';

export const metadata: Metadata = {
  title: 'User',
};

interface UserPageProps {
  params: { username: string };
}

const UserPage: NextPage<UserPageProps> = ({ params }) => {
  return (
    <>
      <Header />
      <UserProfile username={params.username} />
    </>
  );
};

export default withLogin(UserPage);
