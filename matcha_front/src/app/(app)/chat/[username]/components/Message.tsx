import { FC, PropsWithChildren } from 'react';
import Image from 'next/image';

interface MessageProps extends PropsWithChildren {
  avatar: string;
}

const Message: FC<MessageProps> = ({ children, avatar }) => {
  return (
    <>
      {children}
      <figure className="relative ml-2 h-[30px] w-[30px] overflow-hidden rounded-full border-2 border-brown">
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
    </>
  );
};

export default Message;
