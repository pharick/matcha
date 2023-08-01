import { FC } from 'react';
import useWebSocket from 'react-use-websocket';

const Notifications: FC = () => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/notifications/`
  );

  return <></>;
};

export default Notifications;
