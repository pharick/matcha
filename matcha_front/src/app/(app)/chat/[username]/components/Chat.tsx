'use client';

import { FC, useRef, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import Message from './Message';
import MessagesSideBar from './MessagesSideBar';

interface ChatProps {
  currentUser: User;
  user: User;
}

interface NewChatMesageValues {
  message?: string;
}

const Chat: FC<ChatProps> = ({ currentUser, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageList = useRef<HTMLUListElement>(null);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/chat/${user.username}/`
  );

  useEffect(() => {
    if (lastJsonMessage == null) return;
    const message = lastJsonMessage as ChatMessage;
    console.log(message);
    setMessages((m) => [...m, message]);
  }, [lastJsonMessage]);

  useEffect(() => {
    if (messageList.current)
      messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [messages]);

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
      <MessagesSideBar />
      <div className="relative flex flex-1 flex-col px-2">
        <ul ref={messageList} className="flex-1 overflow-y-auto scroll-smooth">
          {messages.map((m, i) => (
            <li
              key={i}
              className={`${
                m.from_user_id == currentUser.id && 'ml-auto'
              } m-2  flex w-fit items-center rounded-lg bg-neutral/50 p-3`}
            >
              {m.from_user_id == currentUser.id ? (
                <Message avatar={currentUser.avatar}>{m.text}</Message>
              ) : (
                <Message avatar={user.avatar}>{m.text}</Message>
              )}
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
