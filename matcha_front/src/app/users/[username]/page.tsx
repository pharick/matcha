import { NextPage } from 'next';
import { cookies } from 'next/headers';

import Header from '@/components/Header';
import UserProfile from './components/UserProfile';
import { User } from '../../../types';

interface UserPageProps {
  params: { username: string };
}

const getUser = async (username: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  console.log(token);
  const requestOptions = {
    // headers: { Authorization: `Bearer ${userToken}` },
  };
  const uri = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${username}/`;
  const res = await fetch(uri, requestOptions);
  if (!res.ok) throw Error('hehe');
  const user = (await res.json()) as User;
  return user;
};

const UserPage: NextPage<UserPageProps> = async ({ params: { username } }) => {
  const user: User = await getUser(username);

  return (
    <>
      <Header />
      <UserProfile user={user} />
    </>
  );
};

export default UserPage;
