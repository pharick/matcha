import { NextPage, Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat',
};

const ChatPage: NextPage = () => (
  <p className="justify-center text-center font-bold">Please, select chat</p>
);

export default ChatPage;
