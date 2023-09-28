import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import MessagesSideBar from './components/MessagesSideBar';
import { getCurrentUser } from '@/api/auth';
import { getAllChats } from '@/api/chat';

export const metadata: Metadata = {
  title: 'Chat',
};

const ChatPage: NextPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');
  if (!currentUser.active) redirect('/profile');
  const chats = await getAllChats();

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 flex flex-row overflow-hidden rounded-lg border border-brown bg-green-5/50 text-right shadow-lg">
      <MessagesSideBar chats={chats} />
      <div className="relative hidden flex-1 flex-col justify-center lg:flex">
        <p className="justify-center text-center font-bold">
          Please, select chat
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
