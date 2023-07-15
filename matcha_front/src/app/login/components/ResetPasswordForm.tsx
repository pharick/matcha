import { FC } from 'react';
import { Form, Formik } from 'formik';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';

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
        <Form>
          <FieldComponent type="email" name="email" className="mb-3">
            Enter your registered email
          </FieldComponent>
          <Button className="m-auto block" type="submit">
            Reset
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
