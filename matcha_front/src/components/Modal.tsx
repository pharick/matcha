import { FC, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
}

const ChangePasswordModal: FC<ModalProps> = ({ children }) => {
  return (
    <div className="absolute top-0 flex h-screen w-screen items-center justify-center">
      <div className="rounded-1xl block h-2/4 w-2/4 bg-green-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
