import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import ProfileForm from './components/ProfileForm';
import { getCurrentUser } from '@/api/auth';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfileInformationPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <ProfileForm user={user} />;
};

export default ProfileInformationPage;
