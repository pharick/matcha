import { NextPage } from 'next';
import type { Metadata } from 'next';

import Header from '@/components/Header';
import SignUpForm from './components/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignUpPage: NextPage = () => {
  return (
    <>
      <Header />

      <div className="mx-auto my-5 flex min-h-screen max-w-[600px] flex-col justify-center">
        <h1 className="mb-[30px] border-b-2 border-brown pb-1 text-center text-xl text-brown">
          Sign Up
        </h1>
        <div className="w-full">
          <SignUpForm />
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
