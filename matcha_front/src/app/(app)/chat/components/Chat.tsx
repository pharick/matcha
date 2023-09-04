'use client';

import { FC, useRef, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { getAllChatMessages } from '@/api/chat';

import Message from './Message';
import ChatUserInfo from './ChatUserInfo';

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
    const getMessages = async () => {
      const msgs = await getAllChatMessages(user.username);
      setMessages(msgs);
    };
    void getMessages();
  }, [user.username]);

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
    <>
      <ChatUserInfo user={user} />
      <ul
        ref={messageList}
        className="flex-1 overflow-y-auto scroll-smooth px-2"
      >
        {messages.map((m, i) => (
          <li
            key={i}
            className={`${m.from_user_id == currentUser.id && 'ml-auto'} w-fit`}
          >
            {m.from_user_id == currentUser.id ? (
              <Message
                avatar={currentUser.avatar}
                timestamp={m.created_at}
                isCurrentUser={true}
              >
                {m.text}
              </Message>
            ) : (
              <Message
                avatar={user.avatar}
                timestamp={m.created_at}
                isCurrentUser={false}
              >
                {m.text}
              </Message>
            )}
          </li>
        ))}
      </ul>

      <div className="w-full">
        <Formik initialValues={initialValues} onSubmit={sendMessage}>
          {() => (
            <Form className="flex flex-row">
              <Field
                className="flex-1  bg-neutral/30 p-2 text-right placeholder:text-brown/60"
                type="text"
                name="message"
                placeholder="Write a message..."
              />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Chat;
