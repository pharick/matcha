import { NextPage } from 'next';

import Chat from './components/Chat';
import { getUserProfile } from '@/api/profile';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';

interface ChatPageProps {
  params: { username: string };
}

const ChatPage: NextPage<ChatPageProps> = async ({ params: { username } }) => {
  const [currentUser, user] = await Promise.all([
    getCurrentUser(),
    getUserProfile(username),
  ]);
  if (!currentUser) redirect('/login');
  if (!user) notFound();

  return <Chat currentUser={currentUser} user={user} />;
};

export default ChatPage;
