'use client';

import { FC, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import FiltersSideBar, { FiltersValues } from '@/components/FiltersSideBar';

interface MatchaProps {
  filtersValues: FiltersValues;
}

const Matcha: FC<MatchaProps> = ({ filtersValues }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex">
      <aside className="w-full rounded-lg bg-green-5/70 px-2 md:w-[400px]">
        <button
          onClick={() => setHidden((h) => !h)}
          className="flex h-[50px] w-full items-center justify-end font-bold md:hidden"
        >
          Filters
          {hidden ? (
            <FiFilter color="#403539" className="ml-2" />
          ) : (
            <GrClose color="#403539" className="ml-2" />
          )}
        </button>
        <FiltersSideBar
          className={`${hidden && 'hidden'} md:block`}
          initialValues={filtersValues}
        />
      </aside>

      <main className="flex-1">{/* TODO */}</main>
    </div>
  );
};

export default Matcha;
