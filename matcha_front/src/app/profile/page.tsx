'use client';
import Image from 'next/image';
import { NextPage } from 'next';
import Header from '@/components/Header';
import ProfileForm from './components/ProfileForm';
import { UserContext, withLogin } from '@/components/UserProvider';
import { useContext } from 'react';
import LeafDown from '@/images/leafe_down.png';

const ProfilePage: NextPage = () => {
  const userContext = useContext(UserContext);
  return (
    <>
      <Header />
      <Image
        className="absolute bottom-0 left-0 -z-50 object-contain"
        src={LeafDown}
        alt="leaf"
        width={1500}
      />
      {userContext.user ? <ProfileForm user={userContext.user} /> : <></>}
    </>
  );
};

export default withLogin(<ProfilePage />);
