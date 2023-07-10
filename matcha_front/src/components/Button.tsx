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
      className="rounded-[20px] border-2 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] text-[24px] font-bold hover:bg-gradient-radial hover:from-green-5/70 hover:to-pink-primary/70"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
