import { Metadata, NextPage } from 'next';
import { Suspense } from 'react';

import { getAllNotifications } from '@/api/notifications';
import NotificationsList from './components/NotificationsList';

export const metadata: Metadata = {
  title: 'Notifications',
};

const UserPage: NextPage = () => {
  const notificationsPromise = getAllNotifications();

  return (
    <>
      <Suspense fallback={<p>Loading</p>}>
        <NotificationsList notificationsPromise={notificationsPromise} />
      </Suspense>
    </>
  );
};

export default UserPage;
