import { FC } from 'react';

import UserCard from '@/components/UserCard';

interface SearchResultsProps {
  usersPromise: Promise<User[]>;
}

const SearchResults: FC<SearchResultsProps> = async ({ usersPromise }) => {
  const users = await usersPromise;

  return (
    <ul className="flex flex-wrap justify-center">
      {users.map((user, index) => (
        <li className="h-[450px] w-[450px] p-3" key={index}>
          <UserCard user={user} avatar={user.avatar} />
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
