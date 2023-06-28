import { FC, ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  type: 'success' | 'warning' | 'error';
}

const Alert: FC<AlertProps> = ({ children, type }) => {
  let colorStyle: 'bg-red-300' | 'bg-yellow-300' | 'bg-green-1';
  if (type == 'success') colorStyle = 'bg-green-1';
  else if (type == 'error') colorStyle = 'bg-red-300';
  else colorStyle = 'bg-yellow-300';
  return (
    <div className="flex">
      <div className="w-2/5"></div>
      <div
        className={`mr-[20px] mt-[20px] w-3/5 rounded-lg text-right ${colorStyle}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Alert;
