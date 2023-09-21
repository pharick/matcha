import { NextPage } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/api/auth';
import MainCard from '@/components/main/MainCard';
import { getAllVisits, getAllVisitsMe } from '@/api/visits';
import { getAllLikes, getAllLikesMe } from '@/api/likes';

const MainPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.active) redirect('/profile');

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <MainCard fetchFunction={getAllLikes}>Users who liked you</MainCard>
      <MainCard fetchFunction={getAllLikesMe}>Users you liked</MainCard>
      <MainCard fetchFunction={getAllVisits}>
        People who visited your page
      </MainCard>
      <MainCard fetchFunction={getAllVisitsMe}>People you have viewed</MainCard>
    </div>
  );
};

export default MainPage;
