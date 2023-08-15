import { FC, Suspense } from 'react';

import FiltersSideBar, {
  FiltersValues,
} from '@/components/matcha/FiltersSideBar';
import SearchResults from './SearchResults';

interface MatchaProps {
  filtersValues: FiltersValues;
  usersPromise: Promise<User[]>;
}

const Matcha: FC<MatchaProps> = ({ filtersValues, usersPromise }) => {
  return (
    <div className="flex flex-wrap">
      <aside className="sticky top-1 z-40 w-full rounded-lg bg-green-5/70 px-2 lg:static lg:w-[400px]">
        <FiltersSideBar initialValues={filtersValues} />
      </aside>

      <main className="flex-1">
        <Suspense fallback={<p>Loading...</p>}>
          <SearchResults usersPromise={usersPromise} />
        </Suspense>
      </main>
    </div>
  );
};

export default Matcha;
