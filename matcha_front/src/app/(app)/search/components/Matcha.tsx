import { FC } from 'react';

import FiltersSideBar from '@/app/(app)/search/components/FiltersSideBar';
import SearchResults from './SearchResults';

export enum SortType {
  Ascending = 'asc',
  Descending = 'desc',
}

export const sortFields = {
  distance: SortType.Ascending,
  age: SortType.Ascending,
  fame_rating: SortType.Descending,
  specific_interests: SortType.Descending,
};

interface MatchaProps {
  searchParams: SearchParams;
}

const Matcha: FC<MatchaProps> = ({ searchParams }) => {
  return (
    <div className="mb-2 h-full min-h-screen flex-wrap lg:flex">
      <aside className="sticky top-1 z-40 mb-2 w-full rounded-lg bg-green-5/70 px-2 lg:static lg:mb-0 lg:mr-2 lg:w-[400px]">
        <FiltersSideBar searchParams={searchParams} />
      </aside>

      <main className="flex-1">
        <SearchResults searchParams={searchParams} />
      </main>
    </div>
  );
};

export default Matcha;
