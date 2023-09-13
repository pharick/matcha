import { Metadata, NextPage } from 'next';

import { getAllNotifications } from '@/api/notifications';
import NotificationsList from './components/NotificationsList';
import { parseIntSearchParam } from '@/helpers';

export const metadata: Metadata = {
  title: 'Notifications',
};

interface NotificationsPageProps {
  searchParams: {
    page: string;
  };
}

const NotificationsPage: NextPage<NotificationsPageProps> = ({
  searchParams: { page },
}) => {
  const PAGE_SIZE = 10;
  const pageInt = parseIntSearchParam(page) ?? 0;
  const notificationsPromise = getAllNotifications(
    pageInt * PAGE_SIZE,
    PAGE_SIZE
  );

  return (
    <NotificationsList
      notificationsPromise={notificationsPromise}
      page={pageInt}
      page_size={PAGE_SIZE}
    />
  );
};

export default NotificationsPage;
