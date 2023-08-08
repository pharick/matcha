'use client';

import { FC, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import SideBar from '@/components/SideBar';

interface MatchaProps {
  currentUser: CurrentUser;
}

const Matcha: FC<MatchaProps> = ({ currentUser }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex">
      <aside className="w-full rounded-lg bg-green-5/70 px-2 md:w-[400px]">
        <button
          onClick={() => setHidden((h) => !h)}
          className="flex h-[50px] w-full items-center justify-end font-bold md:hidden"
        >
          Filter
          {hidden ? (
            <FiFilter color="#403539" className="ml-2" />
          ) : (
            <GrClose color="#403539" className="ml-2" />
          )}
        </button>
        <SideBar
          className={`${hidden && 'hidden'} md:block`}
          currentUser={currentUser}
        />
      </aside>

      <main className="flex-1">{/* TODO */}</main>
    </div>
  );
};

export default Matcha;
