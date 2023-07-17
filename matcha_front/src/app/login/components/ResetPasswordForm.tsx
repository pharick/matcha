import { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import { sleep } from '@/helpers';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Alert from '@/components/Alert';

interface ResetPasswordFormValues {
  email: string;
}

interface ChangePasswordFormProps {
  handleClose: () => void;
}

const ResetPasswordForm: FC<ChangePasswordFormProps> = ({ handleClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const initialValues: ResetPasswordFormValues = {
    email: '',
  };

  const handleChangePassword = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
      }),
    };
    const uri = `/api/send_reset_email`;
    const res = await fetch(uri, requestOptions);
    await sleep(500);
    if (!res.ok) setIsValid(false);
    setIsLoading(false);
  };
  return (
    <>
      {!isValid && (
        <Alert type="error" className="mb-5">
          Invalid email
        </Alert>
      )}
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
          <Button
            loading={isLoading}
            disabled={isLoading}
            className="m-auto block"
            type="submit"
          >
            Reset
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
