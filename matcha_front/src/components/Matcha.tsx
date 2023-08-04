import { FC } from 'react';

import SideBar from '@/components/SideBar';

const Matcha: FC = () => {
  return (
    <div className="flex flex-1">
      <aside className="w-[400px] bg-green-5/70 rounded-lg ">
        <SideBar />
      </aside>
      <main className="flex-1 "></main>
    </div>
  );
};

export default Matcha;
