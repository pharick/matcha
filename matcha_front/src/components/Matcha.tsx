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

  const changeHiddenState = () => {
    setHidden(!hidden);
  };

  return (
    <div className="flex flex-1">
      <aside className="w-full bg-green-5/70 md:hidden rounded-lg px-2">
        <button
          onClick={changeHiddenState}
          className="h-[50px] flex items-center justify-end font-bold w-full"
        >
          Filter
          {hidden ? (
            <FiFilter color="#403539" className="ml-2" />
          ) : (
            <GrClose color="#403539" className="ml-2" />
          )}
        </button>
        {!hidden && (
          <div className="">
            <SideBar currentUser={currentUser} />
          </div>
        )}
      </aside>
      <aside className="w-[400px] rounded-lg bg-green-5/70 hidden md:block">
        <SideBar currentUser={currentUser} />
      </aside>
      <main className="flex-1 ">{/* TODO */}</main>
    </div>
  );
};

export default Matcha;
