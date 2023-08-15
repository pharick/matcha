import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import EmptyCup from '@/images/empty_cup.svg';

export default function NotFound() {
  return (
    <div className="text-center">
      <Image
        src={EmptyCup as StaticImageData}
        width={400}
        alt="empty_cup"
        className="m-auto my-10"
      />
      <h1 className="text-2xl font-bold">User is not found</h1>
      <p>It seems there is no profile with that username</p>
      <Link href="/" className="underline hover:opacity-80">
        Search more
      </Link>
    </div>
  );
}
