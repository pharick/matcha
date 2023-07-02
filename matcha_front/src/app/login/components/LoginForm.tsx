'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';
import * as Yup from 'yup';
import { RegistrationResponse } from '@/app/interfaces';

import { Formik, Form, Field } from 'formik';
import { FC, useState } from 'react';
import Modal from '@/components/Modal';
import ResetPasswordForm from './ResetPasswordForm';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: FC = () => {
  const router = useRouter();
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // console.log(isOpen);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("What's your name?")
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    password: Yup.string().required(
      'Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &).'
    ),
    // .min(6, 'Password must be atleast 6 characters.')
    // .max(36, "Password can't be more than 36 characters"),
  });

  const initialValues: LoginFormValues = { username: '', password: '' };

  const handleAutorization = async (values: LoginFormValues) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    };
    const uri = `/api/login`;
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      const data = (await res.json()) as RegistrationResponse;
      localStorage.setItem('token', data.token);
      router.push('/profile');
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleAutorization}
      >
        {({ errors, touched }) => (
          <Form className="mx-auto flex flex-col [&>*]:mb-[30px]">
            <Field
              id="username"
              name="username"
              placeholder="username"
              className="block"
            />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
            <Field
              id="password"
              name="password"
              placeholder="password"
              className="block"
            />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <Button type="submit">Log In</Button>
            <Link
              className="font-semi-bold text-center text-[28px]"
              href="/signup"
            >
              Sign Up
            </Link>
            {/* <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="underline"
            >
              I forgot my password
            </button> */}
          </Form>
        )}
      </Formik>
      {/* {isOpen && (
        <Modal>
          <ResetPasswordForm handleClose={() => setIsOpen(false)} />
        </Modal>
      )} */}
    </>
  );
};

export default LoginForm;
