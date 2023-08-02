'use client';

import { FC, useEffect, useState } from 'react';
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
        .map((n) => JSON.parse(n));
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
      <button>
        <FaBell size={24} />
      </button>

      <div className="absolute right-0 top-full hidden max-h-[256px] min-w-[270px] overflow-y-auto rounded-xl bg-green-5/80 group-hover:block">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                className="border-b border-b-brown/50 p-2 last:border-0"
                onMouseEnter={() => !n.viewed && markViewed(n.id)}
              >
                <div className="mr-2 flex items-center justify-between text-xs text-gray-600">
                  <p>{format(new Date(n.create_time), 'dd.MM.yyyy H:mm')}</p>
                  {!n.viewed && (
                    <div className="mr-1 h-[7px] w-[7px] rounded-full bg-green-200"></div>
                  )}{' '}
                </div>
                <p>
                  {n.username}{' '}
                  {n.type == 'visit'
                    ? 'visited your profile'
                    : n.type == 'like'
                    ? 'like you'
                    : "don't like you anymore"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-2">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
