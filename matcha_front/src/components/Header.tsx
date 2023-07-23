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
      <div className="mb-5 flex justify-between">
        <div className="flex">
          <Image src={Matcha} width={100} priority alt="logo" />
          <Image src={Cup} width={80} alt="cup" />
        </div>
        <div
          onMouseOver={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="h-full"
        >
          <Image
            src={Profile}
            width={50}
            className="mt-2 rounded-full border-2 border-brown"
            alt="cat"
          />
          {visible && (
            <div className="absolute right-8 z-50 flex w-[280px] flex-col rounded-xl bg-green-5/50 text-center font-bold [&>*]:mb-2">
              <Link href="">hello</Link>
              <Link href="">hello</Link>
              <Link href="">hello</Link>
              <Link href="">Log Out</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
