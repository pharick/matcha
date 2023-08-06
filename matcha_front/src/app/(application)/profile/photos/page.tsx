import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import PhotoUpload from './components/PhotoUpload';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/photos';
import EmailValidationAlert from '../components/EmailValidationAlert';

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
      <PhotoUpload user={user} photos={userPhotos} />
    </>
  );
};

export default ProfilePhotosPage;
