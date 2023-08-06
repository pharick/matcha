'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import useWebSocket from 'react-use-websocket';
import { format } from 'date-fns';

import { FaBell } from 'react-icons/fa6';
import { viewNotification } from '@/api/notifications';

interface NotificationsProps {
  className?: string;
}

const Notifications: FC<NotificationsProps> = ({ className }) => {
  const { lastMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/notifications/`
  );

  const [notifications, setNotifications] = useState<MNotification[]>([]);

  useEffect(() => {
    if (lastMessage !== null) {
      const notifications = (lastMessage.data as string)
        .split('\n\n')
        .map((n) => JSON.parse(n) as MNotification);
      setNotifications((n) => [...notifications, ...n]);
    }
  }, [lastMessage]);

  const markViewed = async (id: number) => {
    await viewNotification(id);
    setNotifications((notifications) =>
      notifications.map((n) => {
        if (n.id == id) n.viewed = true;
        return n;
      })
    );
  };

  return (
    <div className={`group relative flex items-center ${className}`}>
      <button className="relative">
        <FaBell size={24} />
        {notifications.some((n) => !n.viewed) && (
          <div className="w-[10px] h-[10px] rounded-full bg-red-300 absolute top-0 right-0"></div>
        )}
      </button>

      <div className="absolute right-0 top-full hidden min-w-[270px] rounded-xl bg-green-5/90 group-hover:block z-50">
        {notifications.length > 0 ? (
          <ul className="max-h-[256px] overflow-y-auto">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="border-b border-b-brown/50 p-2 last:border-0"
                onMouseEnter={() => !n.viewed && void markViewed(n.id)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    {format(new Date(n.create_time), 'dd.MM.yyyy H:mm')}
                  </p>
                  {!n.viewed && (
                    <div className="h-[10px] w-[10px] rounded-full bg-red-300"></div>
                  )}{' '}
                </div>
                <p>
                  <Link
                    className="underline hover:opacity-80"
                    href={`/users/${n.username}`}
                  >
                    {n.username}
                  </Link>{' '}
                  {n.type == 'visit'
                    ? 'visited your profile'
                    : n.type == 'like'
                    ? 'likes you'
                    : "don't like you anymore"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-2 text-center">No new notifications</p>
        )}
        <Link
          href="/notifications"
          className="block text-center underline py-2 border-t border-b-brown/50 hover:text-brown/80"
        >
          All notifications
        </Link>
      </div>
    </div>
  );
};

export default Notifications;
