'use client';

import { FC, useEffect, useState } from 'react';

import UserCard from '@/components/UserCard';
import { search } from '@/api/search';
import Button from '../Button';

const SearchResultsLoading: FC = () => (
  <>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
  </>
);

interface SearchResultsProps {
  searchParams: SearchParams;
}

const BATCH_SIZE = 8;
const startTime = new Date();

const SearchResults: FC<SearchResultsProps> = ({ searchParams }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [batchN, setBatchN] = useState(0);

  useEffect(() => {
    const load = async () => {
      setUsers([]);
      setLoading(true);
      const res = await search(
        searchParams,
        0,
        BATCH_SIZE,
        startTime.toISOString()
      );
      setUsers(res);
      setLoading(false);
      setBatchN((n) => n + 1);
    };
    void load();
  }, [searchParams]);

  const loadMore = async () => {
    setLoading(true);
    const res = await search(
      searchParams,
      batchN * BATCH_SIZE,
      BATCH_SIZE,
      startTime.toISOString()
    );
    setUsers((users) => [...users, ...res]);
    setLoading(false);
    setBatchN((n) => n + 1);
  };

  if (!loading && users.length <= 0)
    return <p className="my-4 text-center text-lg">No matches found</p>;
  else
    return (
      <>
        <ul className="mb-2 grid grid-cols-[repeat(auto-fill,_450px)] justify-center gap-2">
          {users.map((user, index) => (
            <li className="h-[450px]" key={index}>
              <UserCard user={user} avatar={user.avatar} />
            </li>
          ))}
          {loading && <SearchResultsLoading />}
        </ul>
        <Button className="mx-auto" onClick={() => void loadMore()}>
          Load more
        </Button>
      </>
    );
};

export default SearchResults;
