import { FC, ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  type: 'success' | 'warning' | 'error';
}

const Alert: FC<AlertProps> = ({ children, type }) => {
  let colorStyle: 'bg-red-300/50' | 'bg-yellow-300/50' | 'bg-green-1/50';
  if (type == 'success') colorStyle = 'bg-green-1/50';
  else if (type == 'error') colorStyle = 'bg-red-300/50';
  else colorStyle = 'bg-yellow-300/50';
  return (
    <div className="flex">
      <div className="w-2/5"></div>
      <div
        className={`mr-[20px] mt-[20px] ml-[20px] w-3/4 rounded-lg text-right ${colorStyle}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Alert;
