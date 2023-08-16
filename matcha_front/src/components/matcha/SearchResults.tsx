'use client';

import { FC, useEffect, useState } from 'react';

import UserCard from '@/components/UserCard';
import { search } from '@/api/search';

interface SearchResultsProps {
  searchParams: SearchParams;
}

const SearchResults: FC<SearchResultsProps> = ({ searchParams }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await search(searchParams);
      setUsers(res);
    };
    void load();
  }, [searchParams]);

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,_450px)] justify-center gap-2">
      {users.map((user, index) => (
        <li className="h-[450px]" key={index}>
          <UserCard user={user} avatar={user.avatar} />
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
