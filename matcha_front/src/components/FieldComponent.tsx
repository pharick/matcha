// import { useField, ErrorMessage, FieldHookConfig } from 'formik';
// import { FC, InputHTMLAttributes, ReactNode } from 'react';

// interface FieldComponentProps extends InputHTMLAttributes<HTMLInputElement> {
//   children: ReactNode;
//   name: string;
//   validate?: (value: any) => undefined | string | Promise<any>;
//   type?: string;
//   multiple?: boolean;
//   value?: string;
// }

// const FieldComponent: FC<FieldComponentProps> = ({
//   children,
//   ...props
// }: FieldComponentProps) => {
//   const [field, meta] = useField(props);
//   return (
//     <div>
//       <input
//         placeholder={children}
//         {...field}
//         {...props}
//       />
//       {meta.touched && meta.error && (
//         <div>
//           <ErrorMessage name={field.name} />
//         </div>
//       )}
//     </div>
//   );
// };

import { Field } from 'formik';
import { FC, ReactNode } from 'react';

interface FieldProps {
  name: string;
  label?: string;
  children: ReactNode;
  errors?: string;
  touched?: boolean;
}

const FieldComponent: FC<FieldProps> = ({
  name,
  label,
  children,
  errors,
  touched,
}) => (
  <div>
    <label className="font-bold">{label}</label>
    <Field
      id={name}
      name={name}
      placeholder={children}
      className="block h-[50px] w-full rounded-[20px] border border-none bg-gradient-radial from-green-1/70 to-neutral/30 text-center "
    />
    {errors && touched ? (
      <div className="text-center text-pink-800">{errors}</div>
    ) : null}
  </div>
);

export default FieldComponent;
