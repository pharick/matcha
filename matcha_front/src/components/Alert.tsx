import { FC, PropsWithChildren } from 'react';

interface AlertProps extends PropsWithChildren {
  type: 'success' | 'warning' | 'error';
  className?: string;
}

const Alert: FC<AlertProps> = ({ children, type, className }) => {
  let colorStyle: 'bg-red-300/50' | 'bg-yellow-300/50' | 'bg-green-1/50';
  if (type == 'success') colorStyle = 'bg-green-1/50';
  else if (type == 'error') colorStyle = 'bg-red-300/50';
  else colorStyle = 'bg-yellow-300/50';
  return (
    <div
      className={`rounded-lg p-2 text-center ${colorStyle} ${className ?? ''}`}
    >
      {children}
    </div>
  );
};

export default Alert;
