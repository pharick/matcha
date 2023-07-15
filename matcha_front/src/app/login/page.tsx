import { NextPage } from 'next';
import type { Metadata } from 'next';

import Logo from './components/Logo';
import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage: NextPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto my-[100px] w-[350px]">
        <Logo />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
