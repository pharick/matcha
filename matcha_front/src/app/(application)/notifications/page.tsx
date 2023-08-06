import { Metadata, NextPage } from 'next';

import { getAllNotifications } from '@/api/notifications';
import NotificationsList from './components/NotificationsList';

export const metadata: Metadata = {
  title: 'Notifications',
};

const UserPage: NextPage = () => {
  const notificationsPromise = getAllNotifications();

  return <NotificationsList notificationsPromise={notificationsPromise} />;
};

export default UserPage;
