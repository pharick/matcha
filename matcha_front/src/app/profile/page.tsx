import { NextPage } from 'next';
import type { Metadata } from 'next';

import { withLogin } from '@/helpers';
import Header from '@/components/Header';
import Profile from './components/Profile';

export const metadata: Metadata = {
  title: 'Profile settings',
};

const ProfilePage: NextPage = () => {
  return (
    <>
      <Header />
      <Profile />
    </>
  );
};

export default withLogin(ProfilePage);
