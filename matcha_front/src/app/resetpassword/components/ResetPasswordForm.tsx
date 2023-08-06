'use client';

import { FC } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import { resetPassword } from '@/api/auth';

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

  const passwordRequiremets =
    'Password shoud be at least six characters long and contain at least one number, letter and punctuation mark (such as ! and &)';

  const validationSchema = Yup.object({
    password: Yup.string()
      .required(passwordRequiremets)
      .min(6, 'Password must be atleast 6 characters')
      .max(36, "Password can't be more than 36 characters")
      .matches(/[0-9]/, passwordRequiremets)
      .matches(/[a-z]/, passwordRequiremets)
      .matches(/[A-Z]/, passwordRequiremets)
      .matches(/[.#!$%^&*;:{}\-_~()]/, passwordRequiremets),
    confPassword: Yup.string()
      .required('Confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords does not match'),
  });

  const handleChangePassword = async (values: ResetPasswordFormValues) => {
    const token = searchParams.get('token');
    if (!token) return;
    await resetPassword(token, values.password);
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="max-w-[400px] flex-1">
            <h1 className="mb-3 border-b-2 border-brown pb-1 text-center text-xl text-brown">
              Change password
            </h1>
            <FieldComponent
              type="password"
              name="password"
              className="mb-3"
              errors={errors.password}
              touched={touched.password}
            >
              New Password
            </FieldComponent>
            <FieldComponent
              type="password"
              name="confPassword"
              className="mb-3"
              errors={errors.confPassword}
              touched={touched.confPassword}
            >
              Confirm New Password
            </FieldComponent>
            <Button
              className="m-auto block"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
