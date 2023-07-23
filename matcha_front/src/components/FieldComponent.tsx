import { Field } from 'formik';
import { FC, PropsWithChildren, useState } from 'react';

import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface FieldProps extends PropsWithChildren {
  name: string;
  label?: string;
  errors?: string | string[];
  touched?: boolean;
  className?: string;
  type: 'text' | 'password' | 'email' | 'textarea' | 'date';
  disabled?: boolean;
}

const FieldComponent: FC<FieldProps> = ({
  name,
  label,
  children,
  errors,
  touched,
  className,
  type,
  disabled,
}) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [focused, setFocused] = useState(false);

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
          as={type == 'textarea' ? 'textarea' : ''}
          type={
            type == 'password' && passwordShown
              ? 'text'
              : type == 'password'
              ? 'password'
              : type == 'date' && !focused
              ? 'text'
              : type
          }
          id={name}
          name={name}
          placeholder={children}
          className={`block w-full items-center rounded-[20px] bg-transparent bg-gradient-radial from-green-1/70 to-neutral/30 ${
            type == 'textarea'
              ? 'h-[120px] resize-none p-3 text-left'
              : 'h-[50px] px-[16px] text-center leading-[46px]'
          } ${disabled ? 'text-gray-500' : ''}`}
          disabled={disabled}
          onFocus={() => setFocused(true)}
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
