'use client';
import { FC } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RegistrationResponse } from '@/app/interfaces';
import { Field, Form, Formik } from 'formik';
import Button from '@/components/Button';

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
        <Form className="[&>*]:mb-[30px]">
          <Field
            id="password"
            name="password"
            placeholder="New Password"
            className="block w-full"
          />
          <Field
            id="confPassword"
            name="confPassword"
            placeholder="Confirm New Password"
            className="block w-full"
          />
          <Button type="submit">Confirm</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
