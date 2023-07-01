import Button from '@/components/Button';
import { Field, Form, Formik } from 'formik';
import { FC } from 'react';

interface ResetPasswordFormValues {
  email: string;
}

interface ChangePasswordFormProps {
  handleClose: () => void;
}

const ResetPasswordForm: FC<ChangePasswordFormProps> = ({ handleClose }) => {
  const initialValues: ResetPasswordFormValues = {
    email: '',
  };

  const handleChangePassword = async (values: ResetPasswordFormValues) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
      }),
    };
    const uri = `/api/send_reset_email`;
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      handleClose();
    }
  };
  return (
    <>
      <Formik
        // validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
      >
        {/* {({ errors, touched }) => ( */}
        <Form className="[&>*]:mb-[30px]">
          <Field
            id="email"
            name="email"
            placeholder="Enter your registered email"
            className="block w-full"
          />
          <Button type="submit">Reset</Button>
        </Form>
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
