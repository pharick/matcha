import { NextPage, Metadata } from 'next';

import Chat from '../components/Chat';
import { getUserProfile } from '@/api/profile';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import MessagesSideBar from '../components/MessagesSideBar';
import { getAllChats } from '@/api/chat';

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
  if (!currentUser.active) redirect('/profile');
  const user = await getUserProfile(username);
  if (!user) notFound();
  const chats = await getAllChats();
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 flex h-full flex-row overflow-hidden rounded-lg border border-brown bg-green-5/50 text-right shadow-lg">
      <MessagesSideBar className="hidden lg:block" chats={chats} />
      <div className="relative flex flex-1 flex-col justify-center">
        <Chat currentUser={currentUser} user={user} />
      </div>
    </div>
  );
};

export default UserChatPage;
