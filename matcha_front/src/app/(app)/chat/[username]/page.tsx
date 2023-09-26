import { NextPage, Metadata } from 'next';

import Chat from '../components/Chat';
import { getUserProfile } from '@/api/profile';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';

interface ChatPageProps {
  params: { username: string };
}

export async function generateMetadata({
  params: { username },
}: ChatPageProps): Promise<Metadata> {
  const user = await getUserProfile(username);
  return {
    title: user
      ? `Chat with ${user?.first_name} ${user?.last_name}`
      : 'Chat not found',
  };
}

const UserChatPage: NextPage<ChatPageProps> = async ({
  params: { username },
}) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');
  const user = await getUserProfile(username);
  if (!user) notFound();
  return <Chat currentUser={currentUser} user={user} />;
};

export default UserChatPage;
