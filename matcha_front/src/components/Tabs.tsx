'use client';

import { FC, PropsWithChildren, Children, useState } from 'react';

interface TabsProps extends PropsWithChildren {
  captions: string[];
}

const Tabs: FC<TabsProps> = ({ children, captions }) => {
  const [index, setIndex] = useState(0);
  const childrenArray = Children.toArray(children);
  return (
    <div>
      <ul className="mb-4 flex border-b border-brown font-bold">
        {captions.map((caption, i) => (
          <li
            className="flex-1 border-r border-brown/30 last:border-r-0"
            key={i}
          >
            <button
              className={`w-full bg-green-1 p-2 font-bold ${
                i == index ? 'bg-green-2/50' : 'hover:bg-neutral/50'
              }`}
              onClick={() => setIndex(i)}
            >
              {caption}
            </button>
          </li>
        ))}
      </ul>
      {childrenArray[index]}
    </div>
  );
};

export default Tabs;
