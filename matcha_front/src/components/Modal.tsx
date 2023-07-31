import { FC, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

const ChangePasswordModal: FC<ModalProps> = ({ children, onClose, isOpen }) => {
  if (isOpen)
    return (
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-brown/80">
        <div
          onClick={onClose}
          className="absolute bottom-0 left-0 right-0 top-0"
        ></div>
        <div className="absolute block w-2/4 rounded-[20px] bg-green-5 p-4 shadow-md">
          {children}
        </div>
      </div>
    );
};

export default ChangePasswordModal;
