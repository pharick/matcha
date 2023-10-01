'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import useWebSocket from 'react-use-websocket';
import { format } from 'date-fns';
import Image, { StaticImageData } from 'next/image';
import Marquee from 'react-fast-marquee';

import { FaBell } from 'react-icons/fa6';
import { getUnreadNotifications, viewNotification } from '@/api/notifications';
import { getNotificationMessage, getRandomMatchPhrase } from '@/helpers';
import Match from '@/images/Match.svg';

interface NotificationsProps {
  className?: string;
  user: CurrentUser;
}

const Notifications: FC<NotificationsProps> = ({ className, user }) => {
  const [notifications, setNotifications] = useState<MNotification[]>([]);

  const { lastJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/notifications/`,
    undefined,
    user.active && user.gender !== '' && user.avatar !== ''
  );

  const notify = async (n: MNotification) => {
    if (Notification.permission == 'denied') return;
    if (Notification.permission != 'granted') {
      const permission = await Notification.requestPermission();
      if (permission != 'granted') return;
    }
    new Notification(`${n.username} ${getNotificationMessage(n)}`);
  };

  useEffect(() => {
    const getUnread = async () => {
      const notifications = await getUnreadNotifications();
      setNotifications(notifications);
    };
    if (!user.active || user.gender === '' || user.avatar === '') return;
    void getUnread();
  }, [user]);

  useEffect(() => {
    if (lastJsonMessage == null) return;
    const notification = lastJsonMessage as MNotification;
    setNotifications((n) => [notification, ...n]);
    void notify(notification);
  }, [lastJsonMessage]);

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
    <>
      <div className="hidden flex-1 xl:block">
        <div className="m-auto overflow-y-hidden xl:max-w-[500px] 2xl:max-w-[700px]">
          {notifications.some((n) => n.type == 'match' && !n.viewed) && (
            <Marquee speed={50} pauseOnHover={true}>
              <div className="flex items-center">
                {notifications
                  .filter((n) => n.type == 'match' && !n.viewed)
                  .map((n, i) => (
                    <div className="mx-6 flex items-center" key={i}>
                      <Image
                        src={Match as StaticImageData}
                        alt="match"
                        width={80}
                      />
                      <p className="text-lg font-bold">
                        {getRandomMatchPhrase(n.username)}
                      </p>
                      <Image
                        src={Match as StaticImageData}
                        alt="match"
                        width={80}
                      />
                    </div>
                  ))}
              </div>
            </Marquee>
          )}
        </div>
      </div>

      <div className={`group relative ml-3 flex items-center ${className}`}>
        <button className="relative">
          <FaBell size={24} />
          {notifications.some((n) => !n.viewed) && (
            <div className="absolute right-0 top-0 h-[10px] w-[10px] rounded-full bg-red-300"></div>
          )}
        </button>

        <div className="absolute right-0 top-full z-50 hidden min-w-[290px] overflow-hidden rounded-xl bg-green-5/90 shadow group-hover:block">
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
                    {getNotificationMessage(n)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-2 text-center">No new notifications</p>
          )}
          <Link
            href="/notifications"
            className="block border-t border-b-brown/50 py-2 text-center underline hover:text-brown/80"
          >
            All notifications
          </Link>
        </div>
      </div>
    </>
  );
};

export default Notifications;
