import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/api/auth';
import ChangePasswordForm from './components/ChangePasswordForm';
import ChangeEmailForm from './components/ChangeEmailForm';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfileEmailPasswordPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div>
      <ChangePasswordForm />
      <ChangeEmailForm user={user} />
    </div>
  );
};

export default ProfileEmailPasswordPage;
