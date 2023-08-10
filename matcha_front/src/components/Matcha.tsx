'use client';

import { FC, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import FiltersSideBar, { FiltersValues } from '@/components/FiltersSideBar';
import UserCard from './UserCard';

interface MatchaProps {
  filtersValues: FiltersValues;
  usersList: User[];
}

const Matcha: FC<MatchaProps> = ({ filtersValues, usersList }) => {
  const [hidden, setHidden] = useState(true);
  console.log(usersList);

  return (
    <div className="flex flex-wrap">
      <aside className="sticky top-1 z-40 w-full rounded-lg bg-green-5/70 px-2 lg:static lg:w-[400px]">
        <button
          onClick={() => setHidden((h) => !h)}
          className="flex h-[50px] w-full items-center justify-end font-bold lg:hidden"
        >
          Filters
          {hidden ? (
            <FiFilter color="#403539" className="ml-2" />
          ) : (
            <GrClose color="#403539" className="ml-2" />
          )}
        </button>
        <div className="top-0 z-40 w-full lg:sticky">
          <FiltersSideBar
            className={`${hidden && 'hidden'} lg:block`}
            initialValues={filtersValues}
          />
        </div>
      </aside>

      <main className="flex-1">
        <ul className="flex flex-wrap justify-center">
          {usersList.map((user, index) => (
            <li className="h-[500px] w-[500px] p-3" key={index}>
              <UserCard user={user} avatar={user.avatar} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Matcha;
