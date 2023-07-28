import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import Header from '@/components/Header';
import Tabs from '@/components/Tabs';
import EmailValidationAlert from './components/EmailValidationAlert';
import ProfileForm from './components/ProfileForm';
import PhotoUpload from './components/PhotoUpload';
import ChangePasswordForm from './components/ChangePasswordForm';
import ChangeEmailForm from './components/ChangeEmailForm';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/profile';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfilePage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const userPhotos = await getUserPhotos(user.username);

  return (
    <>
      <Header />

      <div className="mx-auto my-[50px] max-w-[700px]">
        {!user.active && <EmailValidationAlert />}

        <Tabs
          captions={[
            'Profile Information',
            'Manage Photos',
            'Email and password',
          ]}
        >
          <ProfileForm user={user} />
          <PhotoUpload user={user} photos={userPhotos} />
          <div>
            <ChangePasswordForm />
            <ChangeEmailForm user={user} />
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
