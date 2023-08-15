import { NextPage } from 'next';

import Matcha from '@/components/matcha/Matcha';
import { getCurrentUser } from '@/api/auth';
import { redirect } from 'next/navigation';
import { parseIntSearchParam } from '@/helpers';
import { FiltersValues } from '@/components/matcha/FiltersSideBar';
import { search } from '@/api/search';
// import MatchSpinner from '@/components/MatchSpinner';

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

  const ageFrom = parseIntSearchParam(searchParams.ageFrom) ?? 18;
  const ageTo = parseIntSearchParam(searchParams.ageTo) ?? 100;
  const fameFrom = parseIntSearchParam(searchParams.fameFrom) ?? 0;
  const fameTo = parseIntSearchParam(searchParams.fameTo) ?? 5;
  const distanceFrom = parseIntSearchParam(searchParams.distanceFrom) ?? 0;
  const distanceTo = parseIntSearchParam(searchParams.distanceTo) ?? 100;
  const tags = !searchParams.tag
    ? currentUser.tags
    : typeof searchParams.tag == 'string'
    ? [searchParams.tag]
    : searchParams.tag;

  const filtersValues: FiltersValues = {
    ageRange: [ageFrom, ageTo],
    fameRange: [fameFrom, fameTo],
    distanceRange: [distanceFrom, distanceTo],
    tags: tags,
  };

  const users = search(
    ageFrom,
    ageTo,
    fameFrom,
    fameTo,
    distanceFrom,
    distanceTo,
    tags
  );

  return (
    <div className="min-h-screen">
      <Matcha filtersValues={filtersValues} usersPromise={users} />
      {/* <MatchSpinner /> */}
    </div>
  );
};

export default SearchPage;
