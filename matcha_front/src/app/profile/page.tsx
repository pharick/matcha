import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import Header from '@/components/Header';
import Profile from './components/Profile';
import { getCurrentUser } from '@/api/auth';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfilePage: NextPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return (
    <>
      <Header />
      <Profile user={currentUser} />
    </>
  );
};

export default ProfilePage;
