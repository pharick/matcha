'use client';
import { NextPage } from 'next';
import Header from '@/components/Header';
import SignUpForm from './SignUpForm';
import Image from 'next/image';
import LeafDown from '@/images/leafe_down.png';

const SignUpPage: NextPage = () => {
  return (
    <>
      <Header />
      <SignUpForm />
      <Image
        className="w-2/2 absolute bottom-0 left-0 -z-50"
        src={LeafDown}
        alt="leaf"
      />
    </>
  );
};

export default SignUpPage;
