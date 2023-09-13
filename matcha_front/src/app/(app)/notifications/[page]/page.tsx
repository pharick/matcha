import { Metadata, NextPage } from 'next';

import { getAllNotifications } from '@/api/notifications';
import NotificationsList from '../components/NotificationsList';
import { parseIntSearchParam } from '@/helpers';

export const metadata: Metadata = {
  title: 'Notifications',
};

interface NotificationsPageProps {
  params: {
    page: string;
  };
}

const NotificationsPage: NextPage<NotificationsPageProps> = ({
  params: { page },
}) => {
  const PAGE_SIZE = 5;
  const pageInt = parseIntSearchParam(page) ?? 0;
  const notificationsPromise = getAllNotifications(
    pageInt * PAGE_SIZE,
    PAGE_SIZE
  );

  return <NotificationsList notificationsPromise={notificationsPromise} />;
};

export default NotificationsPage;
