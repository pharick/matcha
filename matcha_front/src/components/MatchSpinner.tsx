'use client';
import Image from 'next/image';
import { useState } from 'react';

import Match from '@/images/Match.svg';

const MatchSpinner = () => {
  const [visible, isVisible] = useState<boolean>(true);

  if (visible)
    return (
      <div
        className="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-neutral/50"
        onClick={() => isVisible(false)}
      >
        <Image src={Match} alt="match" className="h-full" width={500} />
      </div>
    );
};

export default MatchSpinner;
