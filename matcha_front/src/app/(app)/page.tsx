import { NextPage } from 'next';
import { redirect } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';

import { getCurrentUser } from '@/api/auth';
import DefaultProfilePicture from '@/images/default_profile_picture.svg';
import { birthdateToAge } from '@/helpers';

const MainPage: NextPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.active) redirect('/profile');

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="min-h-[350px] rounded-lg bg-neutral/50 p-5">
        <h2 className="rounded-lg bg-green-2 px-5 font-bold">
          People who visited you
        </h2>
        <ul className="mx-3 mt-3 rounded-lg bg-green-5/50">
          <li className="flex h-[80px] items-center border-b border-brown/50 px-5">
            <figure className="relative h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-brown">
              <Image
                src={
                  user.avatar && user.avatar.startsWith('http')
                    ? user.avatar
                    : user.avatar
                    ? `${process.env.NEXT_PUBLIC_BACK_BASE_URL}${user.avatar}`
                    : (DefaultProfilePicture as StaticImageData)
                }
                fill={true}
                className="object-cover"
                sizes="100px"
                alt="photo"
              />
            </figure>
            <h1 className="mx-2 font-bold">
              {user.first_name} {user.last_name}
            </h1>
            <div className="flex items-center text-xl">
              {birthdateToAge(user.birth_date)}
              {user.gender == 'male' ? (
                <PiGenderMaleBold />
              ) : user.gender == 'female' ? (
                <PiGenderFemaleBold />
              ) : (
                <PiGenderIntersexBold />
              )}
            </div>
          </li>
          <li className="h-[80px] border-b border-brown/50"></li>
          <li className="h-[80px] border-b border-brown/50"></li>
          <li className="h-[80px] border-b border-brown/50"></li>
          <li className="h-[80px]"></li>
        </ul>
        <div className="flex h-[50px] items-center justify-center">Page</div>
      </div>
      <div className="min-h-[350px] rounded-lg bg-neutral/50 p-5">
        <h2 className="rounded-lg bg-green-2 px-5 font-bold">
          People who liked you
        </h2>
      </div>
      <div className="min-h-[350px] rounded-lg bg-neutral/50 p-5">
        <h2 className="rounded-lg bg-green-2 px-5 font-bold">
          People who visited you
        </h2>
      </div>
      <div className="min-h-[350px] rounded-lg bg-neutral/50 p-5">
        <h2 className="rounded-lg bg-green-2 px-5 font-bold">
          People who liked you
        </h2>
      </div>
    </div>
  );
};

export default MainPage;
