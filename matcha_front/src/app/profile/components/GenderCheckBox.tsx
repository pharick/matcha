import { Field } from 'formik';
import { FC } from 'react';

interface GenderCheckBoxProps {
  type: 'radio' | 'checkbox';
  name: 'gender' | 'gender_preferencies';
}

const GenderCheckBox: FC<GenderCheckBoxProps> = ({ type, name }) => {
  return (
    <div className="flex font-bold">
      <label className="mr-[20px]">
        <Field type={type} name={name} value="male" className="m-auto block" />
        Male
      </label>
      <label className="mr-[20px]">
        <Field
          type={type}
          name={name}
          value="female"
          className="m-auto block"
        />
        Female
      </label>
      <label className="mr-[20px]">
        <Field type={type} name={name} value="other" className="m-auto block" />
        Other
      </label>
    </div>
  );
};

export default GenderCheckBox;
