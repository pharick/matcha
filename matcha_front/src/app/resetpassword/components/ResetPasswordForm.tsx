'use client';
import { FC } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RegistrationResponse } from '@/app/interfaces';
import { Field, Form, Formik } from 'formik';
import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';

interface ResetPasswordFormValues {
  password: string;
  confPassword: string;
}

const ResetPasswordForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValues: ResetPasswordFormValues = {
    password: '',
    confPassword: '',
  };

  const handleChangePassword = async (values: ResetPasswordFormValues) => {
    const emailToken = searchParams.get('token');
    console.log(emailToken);
    if (!emailToken) return;
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        token: emailToken,
        password: values.password,
      }),
    };
    const uri = `/api/password_reset`;
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      const data = (await res.json()) as RegistrationResponse;
      localStorage.setItem('token', data.token);
      router.push('/login');
    }
  };
  return (
    <div className="absolute top-0 flex h-screen w-screen items-center justify-center">
      <Formik
        // validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
      >
        {/* {({ errors, touched }) => ( */}
        <Form>
          <FieldComponent type="password" name="password" className="mb-3">
            New Password
          </FieldComponent>
          <FieldComponent type="password" name="confPassword" className="mb-3">
            Confirm New Password
          </FieldComponent>
          <Button className="m-auto block" type="submit">
            Confirm
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
