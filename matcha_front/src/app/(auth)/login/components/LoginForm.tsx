'use client';

import { FC, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Alert from '@/components/Alert';
import { login } from '@/api/auth';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: FC = () => {
  const [isValid, setIsValid] = useState(true);

  const validationSchema = Yup.object({
    username: Yup.string().required("What's your username?"),
    password: Yup.string().required('Enter your password'),
  });

  const initialValues: LoginFormValues = { username: '', password: '' };

  const handleLogin = async ({ username, password }: LoginFormValues) => {
    setIsValid(true);
    const user = await login(username.toLowerCase(), password);
    if (!user) setIsValid(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="relative mx-auto flex flex-col">
          {!isValid && (
            <Alert type="error" className="mb-5">
              Invalid Username or Password
            </Alert>
          )}

          <FieldComponent
            type="text"
            name="username"
            errors={errors.username}
            touched={touched.username}
            className="mb-5"
          >
            Username
          </FieldComponent>

          <FieldComponent
            type="password"
            name="password"
            errors={errors.password}
            touched={touched.password}
            className="mb-5"
          >
            Password
          </FieldComponent>

          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            Log In
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
