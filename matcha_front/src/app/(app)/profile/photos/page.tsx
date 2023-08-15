import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import PhotoUpload from './components/PhotoUpload';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/photos';
import EmailValidationAlert from '../components/EmailValidationAlert';
import Alert from '@/components/Alert';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfilePhotosPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const userPhotos = await getUserPhotos(user.username);
  if (!userPhotos) redirect('/login');

  return (
    <>
      {!user.active && <EmailValidationAlert />}
      {(!user.avatar ||
        !user.gender ||
        user.gender_preferences.length <= 0) && (
        <Alert type="warning" className="mb-3">
          Please, complete your profile. You shoud fill at least your gender,
          gender&nbsp;preferences and add at least one photo.
        </Alert>
      )}
      <PhotoUpload user={user} photos={userPhotos} />
    </>
  );
};

export default ProfilePhotosPage;
