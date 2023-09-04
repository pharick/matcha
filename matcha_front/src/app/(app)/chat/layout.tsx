import MessagesSideBar from './components/MessagesSideBar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 flex flex-row overflow-hidden rounded-lg border border-brown bg-green-5/50 text-right shadow-lg">
      <MessagesSideBar />
      <div className="relative flex flex-1 flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
