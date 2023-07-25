'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Cup from '@/images/cup.png';
import Profile from '@/images/default_profile_picture.jpg';
import Matcha from '@/images/Matcha.png';

const Header = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <header>
      <div className="mb-5 flex justify-between mt-3">
        <div className="flex">
          <Image src={Matcha} width={100} priority alt="logo" />
          <Image src={Cup} width={80} alt="cup" />
        </div>
        <div
          onMouseOver={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="h-full"
        >
          <figure className="relative h-[60px] w-[60px] rounded-full overflow-hidden">
            <Image
              src={Profile}
              fill={true}
              className="object-cover"
              sizes="100px"
              alt="photo"
            />
          </figure>
          {visible && (
            <div className="absolute right-8 z-50 flex w-[280px] flex-col rounded-xl bg-green-5/50 text-center font-bold [&>*]:mb-2 p-2">
              <Link href="/profile">Profile</Link>
              <Link href="">Matches</Link>
              <Link href="">Messages</Link>
              <Link href="">Log Out</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
