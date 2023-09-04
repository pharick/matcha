import { Metadata, NextPage } from 'next';

import UserProfile from '../components/UserProfile';
import { getUserProfile } from '@/api/profile';
import { getCurrentUser } from '@/api/auth';
import { getUserPhotos } from '@/api/photos';
import { notFound } from 'next/navigation';

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

const UserPage: NextPage<UserPageProps> = async ({ params: { username } }) => {
  const [user, photos] = await Promise.all([
    getUserProfile(username),
    getUserPhotos(username),
  ]);
  if (!user || !photos) notFound();
  return <UserProfile user={user} photos={photos} />;
};

export default UserPage;
