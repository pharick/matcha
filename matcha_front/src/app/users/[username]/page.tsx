import Header from '@/components/Header';
import { Metadata, NextPage } from 'next';
import UserProfile from './components/UserProfile';
import UserPhoto from './components/UserPhoto';

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
      <div className="flex">
        <UserProfile username={params.username} />
        <UserPhoto username={params.username} />
      </div>
    </>
  );
};

export default UserPage;
