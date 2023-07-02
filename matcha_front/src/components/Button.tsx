import { FC, ReactNode } from 'react';

interface BtnProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  children: ReactNode;
}

const Button: FC<BtnProps> = ({ type, children }) => {
  return (
    <button
      className="rounded-[20px] bg-gradient-to-r from-green-2/50 to-green-1/50 text-[28px] font-bold"
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
