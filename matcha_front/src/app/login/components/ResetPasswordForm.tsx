import { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { sleep } from '@/helpers';
import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Alert from '@/components/Alert';

interface ResetPasswordFormValues {
  email: string;
}

enum Result {
  Valid,
  Invalid,
}

const ResetPasswordForm: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Result>();
  const initialValues: ResetPasswordFormValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Enter your email address'),
  });

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
    if (res.ok) setResult(Result.Valid);
    else setResult(Result.Invalid);
    setIsLoading(false);
  };
  return (
    <>
      {result == Result.Valid && (
        <Alert type="success" className="mb-3">
          Check your email for password reset link
        </Alert>
      )}
      {result == Result.Invalid && (
        <Alert type="error" className="mb-3">
          Invalid email
        </Alert>
      )}
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched }) => (
          <Form>
            <FieldComponent
              type="text"
              name="email"
              errors={errors.email}
              touched={touched.email}
              className="mb-3"
            >
              Enter your email
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
        )}
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
