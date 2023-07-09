import { FC, MouseEventHandler, ReactNode } from 'react';

interface BtnProps {
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<BtnProps> = ({ type, children, onClick }) => {
  if (!type) type = 'button';
  return (
    <button
      className="rounded-[20px] bg-gradient-radial from-green-2/50 to-green-1/30 p-[5px] text-[28px] font-bold hover:bg-gradient-radial hover:from-green-5/70 hover:to-pink-primary/70"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
