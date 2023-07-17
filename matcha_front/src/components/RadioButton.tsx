import { FC, PropsWithChildren } from 'react';
import { Field } from 'formik';

interface RadioButtonProps extends PropsWithChildren {
  name: string;
  value: string;
}

const RadioButton: FC<RadioButtonProps> = ({ children, name, value }) => {
  return (
    <div className="group border-r border-brown last:border-r-0">
      <Field
        id={`${name}-${value}`}
        type="radio"
        name={name}
        value={value}
        className="peer hidden"
      />
      <label
        htmlFor={`${name}-${value}`}
        className="box-content block cursor-pointer p-1 text-sm group-first:rounded-l group-last:rounded-r peer-checked:bg-brown peer-checked:text-white"
      >
        {children}
      </label>
    </div>
  );
};

export default RadioButton;
