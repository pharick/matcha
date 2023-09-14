import { NextPage } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/api/auth';
import { getAllLikes, getAllLikesMe } from '@/api/likes';
import { parseIntSearchParam } from '@/helpers';
import MainCard from '@/components/main/MainCard';
import { getAllVisits, getAllVisitsMe } from '@/api/visits';

interface MainPageProps {
  searchParams: {
    page: string;
  };
}

const MainPage: NextPage<MainPageProps> = async ({
  searchParams: { page },
}) => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.active) redirect('/profile');
  const PAGE_SIZE = 5;
  const pageInt = parseIntSearchParam(page) ?? 0;
  const [likes, likesMe, visits, visitsMe] = await Promise.all([
    getAllLikes(pageInt * PAGE_SIZE, PAGE_SIZE),
    getAllLikesMe(pageInt * PAGE_SIZE, PAGE_SIZE),
    getAllVisits(pageInt * PAGE_SIZE, PAGE_SIZE),
    getAllVisitsMe(pageInt * PAGE_SIZE, PAGE_SIZE),
  ]);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <MainCard list={likes.list} total={likes.total} />
      <MainCard list={likesMe.list} total={likesMe.total} />
      <MainCard list={visits.list} total={visits.total} />
      <MainCard list={visitsMe.list} total={visitsMe.total} />
    </div >
  );
};

export default MainPage;
