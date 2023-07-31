import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import PhotoUpload from './components/PhotoUpload';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/photos';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfilePhotosPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const userPhotos = await getUserPhotos(user.username);

  return <PhotoUpload user={user} photos={userPhotos} />;
};

export default ProfilePhotosPage;
