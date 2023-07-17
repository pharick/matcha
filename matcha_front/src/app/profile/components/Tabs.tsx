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
      <ul className="rounded-m mb-4 flex justify-between border-b border-brown text-center font-bold">
        {captions.map((caption, i) => (
          <li className="w-1/3" key={i}>
            <button
              className={`h-full w-full border-brown/30 bg-green-1 p-2 font-bold ${
                i < captions.length - 1 ? 'border-r' : ''
              } ${i == index ? 'bg-green-2/50' : ''} ${
                i != index ? 'hover:bg-neutral/50' : ''
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
