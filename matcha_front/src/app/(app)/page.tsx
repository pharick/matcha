import { NextPage } from 'next';

import Matcha from '@/components/matcha/Matcha';
import { getCurrentUser } from '@/api/auth';
import { redirect } from 'next/navigation';
import { parseIntSearchParam } from '@/helpers';

interface SearchPageProps {
  searchParams: {
    ageFrom?: string;
    ageTo?: string;
    fameFrom?: string;
    fameTo?: string;
    distanceFrom?: string;
    distanceTo?: string;
    tag?: string | string[];
  };
}

const SearchPage: NextPage<SearchPageProps> = async ({ searchParams }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const params: SearchParams = {
    ageFrom: parseIntSearchParam(searchParams.ageFrom) ?? 18,
    ageTo: parseIntSearchParam(searchParams.ageTo) ?? 100,
    fameFrom: parseIntSearchParam(searchParams.fameFrom) ?? 0,
    fameTo: parseIntSearchParam(searchParams.fameTo) ?? 5,
    distanceFrom: parseIntSearchParam(searchParams.distanceFrom) ?? 0,
    distanceTo: parseIntSearchParam(searchParams.distanceTo) ?? 100,
    tags: !searchParams.tag
      ? currentUser.tags
      : typeof searchParams.tag == 'string'
      ? [searchParams.tag]
      : searchParams.tag,
  };

  return (
    <div className="mb-2 min-h-screen">
      <Matcha searchParams={params} />
    </div>
  );
};

export default SearchPage;
