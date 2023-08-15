import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">User is not found</h1>
      <p>It seems there is no profile with that username</p>
      <Link href="/" className="underline hover:opacity-80">
        Search more
      </Link>
    </div>
  );
}
