import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import ProfileForm from './components/ProfileForm';
import { getCurrentUser } from '@/api/auth';
import EmailValidationAlert from '../components/EmailValidationAlert';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfileInformationPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <>
      {!user.active && <EmailValidationAlert />}
      <ProfileForm user={user} />
    </>
  );
};

export default ProfileInformationPage;
