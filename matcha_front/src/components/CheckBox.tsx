import { FC, PropsWithChildren } from 'react';
import { Field } from 'formik';

interface CheckboxProps extends PropsWithChildren {
  name: string;
  value: string;
}

const Checkbox: FC<CheckboxProps> = ({ children, name, value }) => {
  return (
    <div className="flex items-center border-r border-brown px-1 last:border-0">
      <Field
        id={`${name}-${value}`}
        type="checkbox"
        name={name}
        value={value}
        className="mr-1"
      />
      <label
        htmlFor={`${name}-${value}`}
        className="box-content block cursor-pointer text-sm"
      >
        {children}
      </label>
    </div>
  );
};

export default Checkbox;
