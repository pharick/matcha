import { FC, PropsWithChildren } from 'react';
import ShortUserInfo from './ShortUserInfo';
import Link from 'next/link';

interface MainCardProps extends PropsWithChildren {
    list: User[];
    total: number;
    page: number;
    page_size: number;
}

const MainCard: FC<MainCardProps> = ({ list, total, page, page_size, children }) => {
    console.log(total);
    return (
        <div className="min-h-[550px] rounded-lg bg-neutral/50 p-5">
            <h2 className="rounded-lg bg-green-2 px-5 font-bold">
                {children}
            </h2>
            {list.length > 0 ? (
                <>
                    <ul className="mx-3 mt-3 rounded-lg min-h-[450px]">
                        {list.map((n) => (
                            <li
                                key={n.id}
                                className="flex h-[80px] items-center border-b border-brown/50 px-5 bg-green-5/50"
                            >
                                <ShortUserInfo user={n} />
                            </li>
                        ))}
                    </ul>
                    <nav>
                        <ul className="flex justify-center mt-3">
                            <li>
                                {page > 0 ? (
                                    <Link
                                        className="block rounded-l-lg border-2 border-r-0 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold shadow-md transition hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70"
                                        href={`/visits/me?page=${page - 1}`}
                                    >
                                        Prev
                                    </Link>
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
                                    <Link
                                        className="block rounded-r-lg border-2 border-l-0 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold shadow-md transition hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70"
                                        href={`/visits/me?page=${page + 1}`}
                                    >
                                        Next
                                    </Link>
                                ) : (
                                    <span className="block rounded-r-lg border-2 border-l-0 border-gray-500 bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] font-bold text-gray-500 shadow-md">
                                        Next
                                    </span>
                                )}
                            </li>
                        </ul>
                    </nav>
                </>
            ) : (
                <p className="text-center">No notifications yet</p>
            )}
        </div>
    );
};

export default MainCard;
