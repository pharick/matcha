import { Field } from 'formik';
import { FC, PropsWithChildren, useState } from 'react';

import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface FieldProps extends PropsWithChildren {
  name: string;
  label?: string;
  errors?: string;
  touched?: boolean;
  className?: string;
  type: 'text' | 'password' | 'email';
}

const FieldComponent: FC<FieldProps> = ({
  name,
  label,
  children,
  errors,
  touched,
  className,
  type,
}) => {
  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={`${className ?? ''} relative`}>
      {label && (
        <label htmlFor={name} className="font-bold">
          {label}
        </label>
      )}
      <div>
        <Field
          type={
            type == 'password' && passwordShown
              ? 'text'
              : type == 'password'
              ? 'password'
              : type
          }
          id={name}
          name={name}
          placeholder={children}
          className="block h-[50px] w-full items-center rounded-[20px] border border-none bg-transparent bg-gradient-radial from-green-1/70 to-neutral/30 text-center"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute left-full top-3.5 -ml-9"
          >
            {passwordShown ? (
              <FaRegEye size={20} className="text-brown" />
            ) : (
              <FaRegEyeSlash size={20} className="text-brown/50" />
            )}
          </button>
        )}
      </div>

      {errors && touched ? (
        <div className="py-1 text-center text-sm text-pink-800">{errors}</div>
      ) : null}
    </div>
  );
};

export default FieldComponent;
