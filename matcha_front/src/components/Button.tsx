import { FC, ReactNode } from 'react';

interface BtnProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  children: ReactNode;
}

const Button: FC<BtnProps> = ({ type, children }) => {
  return (
    <button
      className="bg-radial-gradient rounded-[20px] from-green-1 to-green-2 text-[28px] font-bold"
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
