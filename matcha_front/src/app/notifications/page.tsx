import { Metadata, NextPage } from 'next';
import { Suspense } from 'react';

import Header from '@/components/header/Header';
import { getCurrentUser } from '@/api/auth';
import { getAllNotifications } from '@/api/notifications';
import NotificationsList from './components/NotificationsList';

export const metadata: Metadata = {
  title: 'Notifications',
};

const UserPage: NextPage = () => {
  const currentUserPromise = getCurrentUser();
  const notificationsPromise = getAllNotifications();

  return (
    <>
      <Header currentUserPromise={currentUserPromise} />

      <Suspense fallback={<p>Loading</p>}>
        <NotificationsList notificationsPromise={notificationsPromise} />
      </Suspense>
    </>
  );
};

export default UserPage;
