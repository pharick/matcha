import { getCurrentUser } from '@/api/auth';

import { redirect } from 'next/navigation';
import { NextPage, Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Location',
};

const UserLocation: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="flex w-full flex-col items-center">
      <p>Longitude</p>
      <p>Attitude</p>
    </div>
  );
};

export default UserLocation;
