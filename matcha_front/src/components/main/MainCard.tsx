'use client';

import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import ShortUserInfo from './ShortUserInfo';

interface MainCardProps extends PropsWithChildren {
  fetchFunction: (
    offset: number,
    limit: number
  ) => Promise<{ list: User[]; total: number }>;
}

const MainCard: FC<MainCardProps> = ({ fetchFunction, children }) => {
  const page_size = 5;
  const [page, setPage] = useState<number>(0);
  const [list, setList] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getPage = useCallback(async () => {
    setLoading(true);
    const res = await fetchFunction(page, page_size);
    setList(res.list);
    setTotal(res.total);
    setLoading(false);
  }, [fetchFunction, page]);

  useEffect(() => {
    void getPage();
  }, [getPage]);

  useEffect(() => {
    void getPage();
  }, [page, getPage]);

  return (
    <div className="min-h-[550px] rounded-lg bg-neutral/50 p-5">
      <h2 className="rounded-lg bg-green-2/60 px-5 py-1 font-bold">
        {children}
      </h2>
      {loading ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="h-[40px] w-[40px] animate-spin rounded-full border-4 border-neutral border-r-brown"></div>
        </div>
      ) : list.length > 0 ? (
        <>
          <ul className="mx-3 mt-3 min-h-[430px] rounded-lg">
            {list.map((user) => (
              <li key={user.id}>
                <Link href={`/users/${user.username}`}>
                  <ShortUserInfo user={user} />
                </Link>
              </li>
            ))}
          </ul>
          {total > page_size && (
            <nav>
              <ul className="flex justify-center">
                <li>
                  {page > 0 ? (
                    <button
                      className="block rounded-l-lg border-2 border-r-0 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold shadow-md transition hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70"
                      onClick={() => setPage(page - 1)}
                    >
                      Prev
                    </button>
                  ) : (
                    <span className="block rounded-l-lg border-2 border-r-0 border-gray-500 bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold text-gray-500 shadow-md">
                      Prev
                    </span>
                  )}
                </li>
                <li>
                  <span className="block border-2 border-brown px-3 py-[5px] font-bold">
                    {page + 1}
                  </span>
                </li>
                <li>
                  {(page + 1) * page_size < total ? (
                    <button
                      className="block rounded-r-lg border-2 border-l-0 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold shadow-md transition hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  ) : (
                    <span className="block rounded-r-lg border-2 border-l-0 border-gray-500 bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold text-gray-500 shadow-md">
                      Next
                    </span>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="flex h-5/6 flex-col justify-center">
          <p className="text-center">Nothing to show here :(</p>
          <Link
            className="block text-center underline hover:opacity-80"
            href="/search"
          >
            Find your next match
          </Link>
        </div>
      )}
    </div>
  );
};

export default MainCard;
