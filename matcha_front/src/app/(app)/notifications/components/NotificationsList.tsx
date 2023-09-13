import Link from 'next/link';
import { FC } from 'react';
import { format } from 'date-fns';

import { getNotificationMessage } from '@/helpers';

interface NotificationsListProps {
  notificationsPromise: Promise<{ list: MNotification[]; total: number }>;
  page: number;
  page_size: number;
}

const NotificationsList: FC<NotificationsListProps> = async ({
  notificationsPromise,
  page,
  page_size,
}) => {
  const { list, total } = await notificationsPromise;

  return (
    <div className="mx-auto mb-6 max-w-[700px]">
      <h1 className="my-5 border-b-2 border-brown pb-1 text-center text-2xl text-brown">
        Notifications history
      </h1>
      {list.length > 0 ? (
        <>
          <ul className="pb-3">
            {list.map((n) => (
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
          <nav>
            <ul className="flex">
              <li>
                {page > 0 ? (
                  <Link
                    className="block rounded-l-lg border-2 border-r-0 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold shadow-md transition hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70"
                    href={`/notifications?page=${page - 1}`}
                  >
                    Prev
                  </Link>
                ) : (
                  <span className="block rounded-l-lg border-2 border-r-0 border-gray-500 bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold text-gray-500 shadow-md">
                    Prev
                  </span>
                )}
              </li>
              <li>
                <span className="block border-2 border-brown px-3 py-[5px] font-bold">
                  {page + 1}
                </span>
              </li>
              <li>
                {(page + 1) * page_size < total ? (
                  <Link
                    className="block rounded-r-lg border-2 border-l-0 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold shadow-md transition hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70"
                    href={`/notifications?page=${page + 1}`}
                  >
                    Next
                  </Link>
                ) : (
                  <span className="block rounded-r-lg border-2 border-l-0 border-gray-500 bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold text-gray-500 shadow-md">
                    Next
                  </span>
                )}
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <p className="text-center">No notifications yet</p>
      )}
    </div>
  );
};

export default NotificationsList;
