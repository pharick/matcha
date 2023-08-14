import { NextPage } from 'next';
// import Image from 'next/image';

import Matcha from '@/components/Matcha';
import { getCurrentUser } from '@/api/auth';
import { redirect } from 'next/navigation';
import { parseIntSearchParam } from '@/helpers';
import { FiltersValues } from '@/components/FiltersSideBar';
import { search } from '@/api/search';
// import Match from '@/images/Match.svg';

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
  const [currentUser, users] = await Promise.all([getCurrentUser(), search()]);
  if (!currentUser) redirect('/login');

  const ageFrom = parseIntSearchParam(searchParams.ageFrom);
  const ageTo = parseIntSearchParam(searchParams.ageTo);
  const fameFrom = parseIntSearchParam(searchParams.fameFrom);
  const fameTo = parseIntSearchParam(searchParams.fameTo);
  const distanceFrom = parseIntSearchParam(searchParams.distanceFrom);
  const distanceTo = parseIntSearchParam(searchParams.distanceTo);
  const tags = !searchParams.tag
    ? currentUser.tags
    : typeof searchParams.tag == 'string'
    ? [searchParams.tag]
    : searchParams.tag;

  const filtersValues: FiltersValues = {
    ageRange: [ageFrom ?? 18, ageTo ?? 100],
    fameRange: [fameFrom ?? 0, fameTo ?? 5],
    distanceRange: [distanceFrom ?? 0, distanceTo ?? 100],
    tags: tags,
  };

  return (
    <div className="min-h-screen">
      <Matcha filtersValues={filtersValues} usersList={users} />
      {/* <div className="absolute top-0 z-40 flex h-full w-full items-center justify-center">
        <Image src={Match} alt="match" />
      </div> */}
    </div>
  );
};

export default SearchPage;
