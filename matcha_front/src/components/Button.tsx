import { FC, MouseEventHandler, ReactNode } from 'react';

interface BtnProps {
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button: FC<BtnProps> = ({
  type,
  children,
  onClick,
  className,
  loading,
  disabled,
}) => {
  if (!type) type = 'button';
  return (
    <button
      className={`block flex min-w-[150px] items-center justify-center rounded-[20px] border-2 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] text-[24px] font-bold shadow-md hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70 active:translate-x-px active:translate-y-px active:shadow-none disabled:bg-neutral ${
        className ?? ''
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {loading && (
        <div className="mr-2 h-[20px] w-[20px] animate-spin rounded-full border-4 border-neutral border-r-brown"></div>
      )}
      {children}
    </button>
  );
};

export default Button;
