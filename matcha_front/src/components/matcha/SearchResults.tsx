'use client';

import { FC, useEffect, useState } from 'react';

import UserCard from '@/components/UserCard';
import { search } from '@/api/search';
import { GoSortAsc, GoSortDesc } from 'react-icons/go';

const SearchResultsLoading: FC = () => (
  <>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
  </>
);

interface SearchResultsProps {
  searchParams: SearchParams;
}

enum SortType {
  Ascending,
  Descending,
}

interface SortingSettings {
  distance?: SortType;
}

const SearchResults: FC<SearchResultsProps> = ({ searchParams }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [sortSettings, setSortSettings] = useState<SortingSettings>({});

  const changeSort = (field: 'distance') => {
    setSortSettings((s) => {
      const ns = { ...s };
      if (ns[field] == undefined) ns[field] = SortType.Ascending;
      else if (ns[field] == SortType.Ascending) ns[field] = SortType.Descending;
      else if (ns[field] == SortType.Descending) ns[field] = undefined;
      return ns;
    });
  };

  const sortFunction = (a: User, b: User) => {
    const dDist =
      sortSettings.distance == SortType.Ascending
        ? a.distance - b.distance
        : sortSettings.distance == SortType.Descending
        ? b.distance - a.distance
        : 0;
    return dDist;
  };

  useEffect(() => {
    const load = async () => {
      setUsers([]);
      setLoading(true);
      const res = await search(searchParams);
      setUsers(res);
      setLoading(false);
    };
    void load();
  }, [searchParams]);

  if (!loading && users.length <= 0)
    return <p className="my-4 text-center text-lg">No matches found</p>;
  else
    return (
      <>
        <div className="mb-3 flex border-b border-brown pb-1">
          <h2 className="mr-1 font-bold">Sorting:</h2>
          <ul>
            <li>
              <button
                className="flex items-center rounded border border-brown px-1"
                onClick={() => changeSort('distance')}
              >
                Distance
                <span className="ml-1">
                  {sortSettings.distance == SortType.Ascending ? (
                    <GoSortAsc />
                  ) : sortSettings.distance == SortType.Descending ? (
                    <GoSortDesc />
                  ) : (
                    ''
                  )}
                </span>
              </button>
            </li>
          </ul>
        </div>

        <ul className="grid grid-cols-[repeat(auto-fill,_450px)] justify-center gap-2">
          {users.sort(sortFunction).map((user, index) => (
            <li className="h-[450px]" key={index}>
              <UserCard user={user} avatar={user.avatar} />
            </li>
          ))}
          {loading && <SearchResultsLoading />}
        </ul>
      </>
    );
};

export default SearchResults;
