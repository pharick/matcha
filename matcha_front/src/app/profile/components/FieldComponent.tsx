import { Field } from 'formik';
import { FC, ReactNode } from 'react';

interface FieldProps {
  field:
    | 'username'
    | 'first_name'
    | 'last_name'
    | 'email'
    | 'biography'
    | 'tags';
  children: ReactNode;
}

const FieldComponent: FC<FieldProps> = ({ field, children }) => (
  <Field
    id={field}
    name={field}
    placeholder={children}
    className="block h-[50px] w-full rounded-[20px] border border-none bg-gradient-radial from-green-1/70 to-neutral/30 text-center "
  />
);

export default FieldComponent;
