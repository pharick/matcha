import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

import SignUpForm from './components/SignUpForm';
import { getCurrentUser } from '@/api/auth';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignUpPage: NextPage = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect('/');

  return (
    <div className="mx-auto my-5 flex min-h-screen max-w-[600px] flex-col justify-center">
      <h1 className="mb-5 border-b-2 border-brown pb-1 text-center text-xl text-brown">
        Sign Up
      </h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
