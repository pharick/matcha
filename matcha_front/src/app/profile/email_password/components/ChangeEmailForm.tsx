'use client';

import { FC, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Alert from '@/components/Alert';
import { changeEmail } from '@/api/auth';

interface ChangeEmailFormProps {
  user: User;
}

interface ChangeEmailFormValues {
  password: string;
  email: string;
}

const ChangeEmailForm: FC<ChangeEmailFormProps> = ({ user }) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [result, setResult] = useState<boolean>(false);

  const initialValues: ChangeEmailFormValues = {
    email: user.email,
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Enter valid email').required('Enter your email'),
    password: Yup.string().required('Enter your password'),
  });

  const handleChangeEmail = async (
    values: ChangeEmailFormValues,
    { resetForm }: FormikHelpers<ChangeEmailFormValues>
  ) => {
    const user = await changeEmail(values.password, values.email);
    setResult(true);
    if (!user) setIsValid(false);
    else {
      setIsValid(true);
      resetForm();
    }
  };

  return (
    <>
      <h3 className="my-5 border-b-2 border-brown pb-1 text-center text-xl text-brown">
        Change email
      </h3>
      {result && isValid && (
        <Alert type="success" className="mb-3">
          Email is changed
        </Alert>
      )}
      {!isValid && result && (
        <Alert type="error" className="mb-3">
          Invalid password
        </Alert>
      )}
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangeEmail}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <FieldComponent
              type="text"
              name="email"
              className="mb-3"
              errors={errors.email}
              touched={touched.email}
            >
              Email
            </FieldComponent>
            <FieldComponent
              type="password"
              name="password"
              className="mb-3"
              errors={errors.password}
              touched={touched.password}
            >
              Password
            </FieldComponent>
            <Button
              className="ml-auto"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangeEmailForm;
