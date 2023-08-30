'use client';

import { FC } from 'react';
import { Field, Form, Formik } from 'formik';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

interface ChatProps {
  user: User;
}

interface NewChatMesageValues {
  message?: string;
}

const Chat: FC<ChatProps> = ({ user }) => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/chat/${user.username}/`
  );

  useEffect(() => {
    if (lastJsonMessage == null) return;
    const message = lastJsonMessage as ChatMessage;
    console.log(message);
  }, [lastJsonMessage]);

  const initialValues: NewChatMesageValues = {
    message: '',
  };

  const sendMessage = (values: NewChatMesageValues) => {
    if (!values.message) return;
    const msg: ChatMessage = {
      text: values.message,
      me: false,
    };
    sendJsonMessage(msg);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col bg-white">
      <ul className="flex-1 overflow-y-auto">
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
        <li>Message</li>
      </ul>

      <div className="bg-green-1/50 p-2">
        <Formik initialValues={initialValues} onSubmit={sendMessage}>
          {() => (
            <Form>
              <Field type="text" name="message" placeholder="Message" />
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Chat;
