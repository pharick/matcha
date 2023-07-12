'use client';
import { NextPage } from 'next';
import Logo from './components/Logo';
import LoginForm from './components/LoginForm';
import Modal from '@/components/Modal';
import ResetPasswordForm from './components/ResetPasswordForm';
import { useState } from 'react';

const LoginPage: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto my-[100px] w-[350px]">
        <Logo />
        <LoginForm />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mx-auto block font-bold underline"
        >
          I forgot my password
        </button>
      </div>
      {isOpen && (
        <Modal handleClose={() => setIsOpen(false)}>
          <ResetPasswordForm handleClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;
