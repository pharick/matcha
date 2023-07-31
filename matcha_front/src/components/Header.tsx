'use client';
import { FC, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import Cup from '@/images/cup.png';
import DefaultProfilePicture from '@/images/default_profile_picture.jpg';
import Matcha from '@/images/Matcha.png';
import { logout } from '@/api/auth';

interface HeaderProps {
  user: User;
}

const Header: FC<HeaderProps> = ({ user }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <header>
      <div className="mb-5 mt-3 flex justify-between">
        <div className="flex">
          <Image src={Matcha} width={100} priority alt="logo" />
          <Image src={Cup} width={80} alt="cup" />
        </div>
        <div
          onMouseOver={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="h-full"
        >
          <figure className="relative h-[60px] w-[60px] overflow-hidden rounded-full">
            {user.username ? (
              <Image
                src={DefaultProfilePicture} //need to fix to user.avatar url
                fill={true}
                className="object-cover"
                sizes="100px"
                alt="photo"
              />
            ) : (
              <Image
                src={DefaultProfilePicture}
                fill={true}
                className="object-cover"
                sizes="100px"
                alt="photo"
              />
            )}
          </figure>
          {visible && (
            <div className="absolute right-8 z-50 flex w-[280px] flex-col rounded-xl bg-green-5/50 p-2 text-center font-bold [&>*]:mb-2">
              <Link href="/profile">Profile</Link>
              <Link href="">Matches</Link>
              <Link href="">Messages</Link>
              <button onClick={() => logout()}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
