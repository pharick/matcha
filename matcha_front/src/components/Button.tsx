import { FC } from 'react';

interface BtnProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  text: string;
}

const Button: FC<BtnProps> = ({ type, text }) => {
  return (
    <button className="rounded-[20px] bg-green-1 text-brown" type={type}>
      {text}
    </button>
  );
};

export default Button;
