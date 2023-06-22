'use client';
import { NextPage } from 'next';
import Header from '@/components/Header';
import ProfileForm from './ProfileForm';
import { UserContext } from '@/components/UserProvider';
import { useContext } from 'react';

const ProfilePage: NextPage = () => {
  const userContext = useContext(UserContext);
  return (
    <>
      <Header />
      {userContext.user ? <ProfileForm user={userContext.user} /> : <></>}
    </>
  );
};

export default ProfilePage;
