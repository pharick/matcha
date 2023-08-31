'use client';

import { FC, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

interface ChatProps {
  currentUser: User;
  user: User;
}

interface NewChatMesageValues {
  message?: string;
}

const Chat: FC<ChatProps> = ({ currentUser, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/chat/${user.username}/`
  );

  useEffect(() => {
    if (lastJsonMessage == null) return;
    const message = lastJsonMessage as ChatMessage;
    console.log(message);
    setMessages((m) => [...m, message]);
  }, [lastJsonMessage]);

  const initialValues: NewChatMesageValues = {
    message: '',
  };

  const sendMessage = (
    values: NewChatMesageValues,
    { resetForm }: FormikHelpers<NewChatMesageValues>
  ) => {
    if (!values.message) return;
    const msg: NewChatMessage = {
      text: values.message,
    };
    sendJsonMessage(msg);
    resetForm();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 mb-4 flex flex-row overflow-hidden rounded-lg bg-green-5/50 text-right">
      <div className="w-[400px] bg-neutral/30"></div>
      <div className="relative flex flex-1 flex-col px-2">
        <ul className="flex-1 overflow-y-auto">
          {messages.map((m, i) => (
            <li
              key={i}
              className={`${
                m.from_user_id == currentUser.id && 'ml-auto'
              } m-2  w-fit rounded-lg bg-neutral/50 p-3`}
            >
              {m.text}
            </li>
          ))}
        </ul>

        <div className="mb-2 w-full">
          <Formik initialValues={initialValues} onSubmit={sendMessage}>
            {() => (
              <Form className="flex flex-row">
                <Field
                  className="flex-1 rounded-lg bg-neutral/30 p-2 placeholder:text-brown/60"
                  type="text"
                  name="message"
                  placeholder="Write a message..."
                  autofocus
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Chat;
