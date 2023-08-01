import { FC, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const Notifications: FC = () => {
  const { lastMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/notifications/`
  );

  useEffect(() => {
    if (lastMessage !== null) {
      const notification = JSON.parse(lastMessage.data) as Notification;
      console.log(notification);
    }
  }, [lastMessage]);

  return <ul></ul>;
};

export default Notifications;
