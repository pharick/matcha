'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';

import UserCard from '@/components/UserCard';
import { search } from '@/api/search';
import SadCup from '@/images/sad_cup.svg';

const SearchResultsLoading: FC = () => (
  <>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
    <li className="h-[450px] animate-pulse rounded-lg bg-green-5/80"></li>
  </>
);

interface SearchResultsProps {
  searchParams: SearchParams;
}

const BATCH_SIZE = 2;
const startTime = new Date();

const SearchResults: FC<SearchResultsProps> = ({ searchParams }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [batchN, setBatchN] = useState(0);
  const [total, setTotal] = useState(1);
  const endMarker = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setUsers([]);
    setBatchN(0);
  }, [searchParams]);

  useEffect(() => {
    const loadMore = async () => {
      setLoading(true);
      const res = await search(
        searchParams,
        batchN * BATCH_SIZE,
        BATCH_SIZE,
        startTime.toISOString()
      );
      setUsers((users) => [...users, ...(res.list as User[])]);
      setBatchN((n) => n + 1);
      setTotal(res.total as number);
      setLoading(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(total, batchN);
        if (
          entries[0].isIntersecting &&
          (users.length < total || batchN == 0) &&
          !loading
        )
          void loadMore();
      },
      { threshold: 1 }
    );

    if (endMarker.current) {
      const ref = endMarker.current;
      observer.observe(endMarker.current);

      return () => {
        observer.unobserve(ref);
      };
    }
  }, [searchParams, endMarker, batchN, loading, total, users.length]);

  if (!loading && users.length <= 0 && batchN > 0)
    return (
      <>
        <Image
          src={SadCup as StaticImageData}
          width={400}
          alt="Empty cup"
          className="m-auto my-3"
        />
        <p className="text-center text-lg font-bold">No matches found</p>
      </>
    );
  else
    return (
      <>
        <ul className="mb-2 grid grid-cols-[repeat(auto-fill,_450px)] justify-center gap-2">
          {users.map((user, index) => (
            <li className="h-[450px]" key={index}>
              <UserCard user={user} avatar={user.avatar} />
            </li>
          ))}
          {loading && <SearchResultsLoading />}
        </ul>
        <p ref={endMarker} className="text-center">
          {users.length >= total && 'No more matches'}
        </p>
      </>
    );
};

export default SearchResults;
