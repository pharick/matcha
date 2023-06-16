import { FC } from 'react';

interface BtnProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  text: string;
}

const Button: FC<BtnProps> = ({ type, text }) => {
  return (
    <button className="rounded-[20px] bg-gradient-radial from-green-2 to-green-5" type={type}>
      {text}
    </button>
  );
};

export default Button;
