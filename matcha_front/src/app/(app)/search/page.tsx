import { NextPage } from 'next';

import Matcha, { sortFields } from '@/app/(app)/search/components/Matcha';
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
    maxDistance: parseIntSearchParam(searchParams.maxDistance) ?? 5000,
    tags: !searchParams.tag
      ? currentUser.tags
      : typeof searchParams.tag == 'string'
      ? [searchParams.tag]
      : searchParams.tag,
    sortField: searchParams.sortField ?? 'distance',
    sortType:
      searchParams.sortType ??
      (Object.keys(sortFields).includes(searchParams.sortField)
        ? sortFields[
            searchParams.sortField as keyof typeof sortFields
          ].toString()
        : sortFields.distance.toString()),
  };

  return <Matcha searchParams={params} />;
};

export default SearchPage;
