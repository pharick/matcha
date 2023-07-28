import { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Alert from '@/components/Alert';
import { resetPassword } from '@/api/auth';

interface ResetPasswordFormValues {
  email: string;
}

const ResetPasswordForm: FC = () => {
  const [result, setResult] = useState<boolean>();

  const initialValues: ResetPasswordFormValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Enter your email address'),
  });

  const handleChangePassword = async (values: ResetPasswordFormValues) => {
    setResult(await resetPassword(values.email));
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleChangePassword}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          {result == true && (
            <Alert type="success" className="mb-3">
              Check your email for password reset link
            </Alert>
          )}
          {result == false && (
            <Alert type="error" className="mb-3">
              Invalid email
            </Alert>
          )}

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
            loading={isSubmitting}
            disabled={isSubmitting}
            className="m-auto block"
            type="submit"
          >
            Reset
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
