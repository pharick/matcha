import { NextPage } from 'next';

import Header from '@/components/Header';
import UserProfile from './components/UserProfile';
import { getUserInfo } from '@/api/profile';
import { getCurrentUser } from '@/api/auth';
import { redirect } from 'next/navigation';

interface UserPageProps {
  params: { username: string };
}

const UserPage: NextPage<UserPageProps> = async ({ params: { username } }) => {
  const user = await getUserInfo(username);
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');
  if (!user) redirect(`/users/${currentUser.username}`);

  return (
    <>
      <Header user={currentUser} />
      <UserProfile user={user} />
    </>
  );
};

export default UserPage;
