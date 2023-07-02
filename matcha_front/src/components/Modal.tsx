import { FC, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  handleClose: () => void;
}

const ChangePasswordModal: FC<ModalProps> = ({ children, handleClose }) => {
  return (
    <div
      onClick={handleClose}
      className="absolute top-0 flex h-screen w-screen items-center justify-center"
    >
      <div className="block w-2/4 rounded-[20px] bg-green-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
