import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import EmptyCup from '@/images/empty_cup.svg';

export default function NotFound() {
  return (
    <div>
      <Image
        src={EmptyCup as StaticImageData}
        width={400}
        alt="empty_cup"
        className="m-auto my-10"
      />
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
