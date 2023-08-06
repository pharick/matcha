'use client';

import { FC, useState } from 'react';

import Modal from '@/components/Modal';
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordLink: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mx-auto block font-bold underline hover:opacity-80"
      >
        I forgot my password
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h1 className="mb-3 border-b-2 border-brown pb-1 text-center text-xl text-brown">
          Reset password
        </h1>
        <ResetPasswordForm />
      </Modal>
    </>
  );
};

export default ResetPasswordLink;
