import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BiRightArrowAlt } from 'react-icons/bi';

import Logo from './components/Logo';
import LoginForm from './components/LoginForm';
import ResetPasswordLink from './components/ResetPasswordLink';
import { getCurrentUser } from '@/api/auth';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage: NextPage = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect('/');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto my-[100px] sm:w-[350px] w-[200px]">
        <Logo />
        <LoginForm />
        <Link
          className="font-semi-bold group my-3 flex items-center justify-center rounded-[20px] border-2 border-transparent p-[5px] text-[22px] hover:border-2 hover:border-brown"
          href="/signup"
        >
          <div className="relative w-fit">
            Sign Up
            <BiRightArrowAlt
              size={30}
              className="absolute left-full top-0.5 hidden group-hover:block"
            />
          </div>
        </Link>
        <ResetPasswordLink />
      </div>
    </div>
  );
};

export default LoginPage;
