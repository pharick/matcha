import { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

interface MessageProps extends PropsWithChildren {
  avatar: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const Message: FC<MessageProps> = ({
  children,
  avatar,
  timestamp,
  isCurrentUser,
}) => {
  return (
    <div className="mb-5 max-w-[600px] ">
      <div className="mx-2 my-1 rounded-lg bg-neutral/50 p-3">
        <p className="break-words text-left">{children}</p>
      </div>
      <div className="mx-3 flex items-center">
        {!isCurrentUser && (
          <p className="mr-1 text-xs text-gray-600">
            {format(new Date(timestamp), 'dd.MM.yyyy H:mm')}
          </p>
        )}
        <figure className="relative h-[30px] w-[30px] overflow-hidden rounded-full border-2 border-brown">
          <Image
            src={
              avatar.startsWith('http')
                ? avatar
                : `${process.env.NEXT_PUBLIC_BACK_BASE_URL}${avatar}`
            }
            fill={true}
            className="object-cover"
            sizes="30px"
            alt="photo"
          />
        </figure>
        {isCurrentUser && (
          <p className="ml-1 text-xs text-gray-600">
            {format(new Date(timestamp), 'dd.MM.yyyy H:mm')}
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;