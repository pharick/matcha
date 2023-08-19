import { NextPage } from 'next';

import Matcha from '@/components/matcha/Matcha';
import { getCurrentUser } from '@/api/auth';
import { redirect } from 'next/navigation';
import { parseIntSearchParam } from '@/helpers';

interface SearchPageProps {
  searchParams: {
    ageFrom?: string;
    ageTo?: string;
    minFame?: string;
    maxDistance?: string;
    tag?: string | string[];
    sortField: string;
    sortType: string;
  };
}

const SearchPage: NextPage<SearchPageProps> = async ({ searchParams }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');
  if (!currentUser.active) redirect('/profile');

  const params: SearchParams = {
    ageFrom: parseIntSearchParam(searchParams.ageFrom) ?? 18,
    ageTo: parseIntSearchParam(searchParams.ageTo) ?? 100,
    minFame: parseIntSearchParam(searchParams.minFame) ?? 0,
    maxDistance: parseIntSearchParam(searchParams.maxDistance) ?? 5,
    tags: !searchParams.tag
      ? currentUser.tags
      : typeof searchParams.tag == 'string'
      ? [searchParams.tag]
      : searchParams.tag,
    sortField: searchParams.sortField,
    sortType: searchParams.sortType,
  };

  return <Matcha searchParams={params} />;
};

export default SearchPage;
