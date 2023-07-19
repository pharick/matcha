'use client'
import Matcha from '@/images/Matcha.png';
import Image from 'next/image';
import Cup from '@/images/cup.png';
import Link from 'next/link';
import Profile from '@/images/default_profile_picture.jpg'
import { useState } from 'react';

const Header = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    setVisible(!visible);
  }

  return (
    <header>
      <div className="flex justify-between">
        <div className="flex">
          <Image src={Matcha} width={100} priority alt="logo" />
          <Image src={Cup} width={80} alt="cup" />
        </div>
          <div onMouseOver={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="h-full">
            <Image  src={Profile} width={50}  className="rounded-full mt-2 border-2 border-brown" alt="cat" />
            {visible && (
              <div className="absolute right-8 bg-green-5/50 z-50 w-[280px] text-center font-bold rounded-xl flex flex-col [&>*]:mb-2">
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
