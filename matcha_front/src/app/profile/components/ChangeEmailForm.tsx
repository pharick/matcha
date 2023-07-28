import { FC, useContext, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import { User } from '../../../types';
import Alert from '@/components/Alert';
import { UserContext } from '@/components/UserProvider';

interface ChangeEmailFormProps {
  user: User;
}

interface ChangeEmailFormValues {
  password: string;
  email: string;
}

enum Result {
  Valid,
  Invalid,
}

const ChangeEmailForm: FC<ChangeEmailFormProps> = ({ user }) => {
  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result>();

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
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
      headers: { Authorization: `Bearer ${userToken}` },
    };
    const uri = `/api/email_change`;
    const res = await fetch(uri, requestOptions);
    setResult(res.ok ? Result.Valid : Result.Invalid);
    setIsLoading(false);
    if (res.ok && userContext.getUser) userContext.getUser();
    if (res.ok) resetForm();
  };
  return (
    <>
      <h3 className="my-5 border-b-2 border-brown pb-1 text-center text-xl text-brown">
        Change email
      </h3>
      {result == Result.Valid && (
        <Alert type="success" className="mb-3">
          Email is changed
        </Alert>
      )}
      {result == Result.Invalid && (
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
        {({ errors, touched }) => (
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
              loading={isLoading}
              disabled={isLoading}
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
