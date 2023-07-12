import { FC, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  handleClose: () => void;
}

const ChangePasswordModal: FC<ModalProps> = ({ children, handleClose }) => {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-brown/50">
      <div
        onClick={handleClose}
        className="absolute bottom-0 left-0 right-0 top-0"
      ></div>
      <div className="absolute block w-2/4 rounded-[20px] bg-green-5 p-4">
        {children}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
