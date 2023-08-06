import { Metadata, NextPage } from 'next';
import { Suspense } from 'react';

import Header from '@/components/header/Header';
import UserProfile from './components/UserProfile';
import { getUserProfile } from '@/api/profile';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/photos';
import UserProfileLoader from './components/UserProfileLoader';

interface UserPageProps {
  params: { username: string };
}

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return {};
  const user = await getUserProfile(username);
  return {
    title: user
      ? `${user?.first_name} ${user?.last_name}`
      : 'Profile not found',
  };
}

const UserPage: NextPage<UserPageProps> = ({ params: { username } }) => {
  const currentUserPromise = getCurrentUser();
  const userPromise = getUserProfile(username);
  const photosPromise = getUserPhotos(username);

  return (
    <>
      <Header currentUserPromise={currentUserPromise} />

      <Suspense fallback={<UserProfileLoader />}>
        <UserProfile userPromise={userPromise} photosPromise={photosPromise} />
      </Suspense>
    </>
  );
};

export default UserPage;
