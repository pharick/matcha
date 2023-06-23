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
    className="block w-full"
  />
);

export default FieldComponent;
