'use client';

import { FC, useState } from 'react';
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
  const [messageFrom, setMessage] = useState<ChatMessage[]>([]);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/api/ws/chat/${user.username}/`
  );

  useEffect(() => {
    if (lastJsonMessage == null) return;
    const message = lastJsonMessage as ChatMessage;
    console.log(message);
    setMessage((m) => [message, ...m]);
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
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-row overflow-hidden rounded-lg bg-green-5/50 text-right">
      <div className="w-[400px] bg-neutral/30"></div>
      <div className="relative flex flex-1 flex-col px-2">
        <ul className="flex-1 overflow-y-auto">
          {messageFrom.map((m, i) => (
            <li
              key={i}
              className="m-2 ml-auto w-fit rounded-lg bg-neutral/50 p-3"
            >
              {m.text}
            </li>
          ))}
        </ul>

        <div className="w-full rounded-lg bg-neutral/30 p-2">
          <Formik initialValues={initialValues} onSubmit={sendMessage}>
            {() => (
              <Form className="flex flex-row">
                <Field
                  className=" flex-1 bg-transparent"
                  type="text"
                  name="message"
                  placeholder="Message"
                />
                <button type="submit">Submit</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Chat;
