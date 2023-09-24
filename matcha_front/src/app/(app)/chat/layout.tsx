'use client';

import MessagesSideBar from './components/MessagesSideBar';

import { useState } from 'react';

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
      <div className="invisible absolute bottom-0 left-0 right-0 top-0 mb-4 flex flex-row overflow-hidden rounded-lg border border-brown bg-green-5/50 text-right shadow-lg lg:visible">
        <MessagesSideBar />
        <div className="relative flex flex-1 flex-col justify-center">
          {children}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 h-full rounded-lg border border-brown bg-green-5/50 lg:hidden">
        {!isChatOpen ? (
          <MessagesSideBar onClick={changeState} />
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-5 z-40" onClick={changeState}>
              Back
            </div>
            {children}
          </div>
        )}
      </div>
    </>
  );
}
