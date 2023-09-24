'use client';

import { FC, useRef, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getAllChatMessages } from '@/api/chat';

import Message from './Message';
import ChatUserInfo from './ChatUserInfo';
import ResponsiveChatUserInfo from './ResponsiveChatUserInfo';

interface ChatProps {
  currentUser: User;
  user: User;
}

interface NewChatMesageValues {
  message?: string;
}

const Chat: FC<ChatProps> = ({ currentUser, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageList = useRef<HTMLUListElement>(null);

  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/chat/${user.username}/`
  );

  useEffect(() => {
    const getMessages = async () => {
      const msgs = await getAllChatMessages(user.username);
      setMessages(msgs);
      setIsLoading(false);
    };
    void getMessages();
  }, [user.username]);

  useEffect(() => {
    if (lastJsonMessage == null) return;
    const message = lastJsonMessage as ChatMessage;
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
      <div className="invisible lg:visible">
        <ChatUserInfo user={user} />
      </div>
      <div className="absolute left-0 right-0 top-0 lg:hidden">
        <ResponsiveChatUserInfo user={user} />
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center">
          <div className="mx-auto h-[70px] w-[70px] animate-spin rounded-full border-8 border-neutral border-r-brown"></div>
        </div>
      ) : messages.length <= 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-bold">No messages yet</p>
        </div>
      ) : (
        <ul
          ref={messageList}
          className="flex-1 overflow-y-auto scroll-smooth px-2"
        >
          {messages.map((m, i) => (
            <li
              key={i}
              className={`${
                m.from_user_id == currentUser.id && 'ml-auto'
              } w-fit`}
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
      )}

      <div className="w-full">
        <Formik initialValues={initialValues} onSubmit={sendMessage}>
          {() => (
            <Form className="flex flex-row">
              <Field
                className="flex-1 bg-neutral/30 p-2 placeholder:text-brown/60"
                type="text"
                name="message"
                placeholder={
                  readyState == ReadyState.CONNECTING
                    ? 'Connecting...'
                    : readyState == ReadyState.CLOSED
                    ? 'You can not send messages to this user'
                    : 'Write a message...'
                }
                disabled={readyState != ReadyState.OPEN}
              />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Chat;
