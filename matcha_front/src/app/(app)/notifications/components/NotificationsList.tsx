import Link from 'next/link';
import { FC } from 'react';
import { format } from 'date-fns';

import { getNotificationMessage } from '@/helpers';

interface NotificationsListProps {
  notificationsPromise: Promise<MNotification[]>;
}

const NotificationsList: FC<NotificationsListProps> = async ({
  notificationsPromise,
}) => {
  const notifications = await notificationsPromise;

  return (
    <div className="mx-auto my-2 max-w-[700px]">
      <h1 className="my-5 border-b-2 border-brown pb-1 text-center text-2xl text-brown">
        Notifications history
      </h1>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              className="border-b border-b-brown/50 p-2 last:border-0"
            >
              <p className="text-xs text-gray-600">
                {format(new Date(n.create_time), 'dd.MM.yyyy H:mm')}
              </p>
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
        <p className="text-center">No notifications yet</p>
      )}
    </div>
  );
};

export default NotificationsList;