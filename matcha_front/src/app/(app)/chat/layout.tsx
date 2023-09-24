'use client';

import MessagesSideBar from './components/MessagesSideBar';

import { useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const changeState = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 hidden flex-row overflow-hidden rounded-lg border border-brown bg-green-5/50 text-right shadow-lg lg:flex">
        <MessagesSideBar />
        <div className="relative flex flex-1 flex-col justify-center">
          {children}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 flex flex-col rounded-lg border border-brown bg-green-5/50 lg:hidden">
        {!isChatOpen ? (
          <MessagesSideBar onClick={changeState} />
        ) : (
          <div className="relative flex h-full flex-col">
            <button
              className="absolute left-5 top-5 z-40"
              onClick={changeState}
            >
              <BiLeftArrowAlt size={30} />
            </button>
            {children}
          </div>
        )}
      </div>
    </>
  );
}
