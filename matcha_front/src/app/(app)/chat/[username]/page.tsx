import { NextPage } from 'next';

import Chat from './components/Chat';
import { getUserProfile } from '@/api/profile';
import { notFound } from 'next/navigation';

interface ChatPageProps {
  params: { username: string };
}

const ChatPage: NextPage<ChatPageProps> = async ({ params: { username } }) => {
  const user = await getUserProfile(username);
  if (!user) notFound();

  return <Chat user={user} />;
};

export default ChatPage;
