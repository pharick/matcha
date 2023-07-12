'use client';
import { NextPage } from 'next';
import { FC, PropsWithChildren, Children, useState } from 'react';

interface TabsProps extends PropsWithChildren {
  captions: string[];
}

const Tabs: FC<TabsProps> = ({ children, captions }) => {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <ul>
        {captions.map((caption, i) => (
          <li key={i}>
            <button onClick={() => setIndex(i)}>{caption}</button>
          </li>
        ))}
      </ul>
      {Children.toArray(children)[index]}
    </div>
  );
};

const TestPage: NextPage = () => {
  return (
    <Tabs captions={['one', 'two', 'three']}>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </Tabs>
  );
};

export default TestPage;
