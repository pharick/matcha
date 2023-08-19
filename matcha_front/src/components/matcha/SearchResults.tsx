'use client';

import { FC, useEffect, useState } from 'react';

import UserCard from '@/components/UserCard';
import { search } from '@/api/search';

const SearchResultsLoading: FC = () => (
  <>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
  </>
);

interface SearchResultsProps {
  searchParams: SearchParams;
}

const SearchResults: FC<SearchResultsProps> = ({ searchParams }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const load = async () => {
      setUsers([]);
      setLoading(true);
      console.log(searchParams);
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
      <ul className="grid grid-cols-[repeat(auto-fill,_450px)] justify-center gap-2">
        {users.map((user, index) => (
          <li className="h-[450px]" key={index}>
            <UserCard user={user} avatar={user.avatar} />
          </li>
        ))}
        {loading && <SearchResultsLoading />}
      </ul>
    );
};

export default SearchResults;
