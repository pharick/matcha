import { Metadata, NextPage } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';

import Header from '@/components/header/Header';
import UserProfile from './components/UserProfile';
import { getUserProfile, visitUserProfile } from '@/api/profile';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/photos';

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
    title: `${user?.first_name} ${user?.last_name}`,
  };
}

const UserPage: NextPage<UserPageProps> = async ({ params: { username } }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const [user] = await Promise.all([
    getUserProfile(username),
    visitUserProfile(username),
  ]);
  if (!user) notFound();

  return (
    <>
      <Header user={currentUser} />

      <Suspense>
        <UserProfile user={user} photosPromise={getUserPhotos(username)} />
      </Suspense>
    </>
  );
};

export default UserPage;
