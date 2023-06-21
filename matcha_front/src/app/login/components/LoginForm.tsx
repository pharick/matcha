'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';
import * as Yup from 'yup';
import { RegistrationResponse } from '@/app/interfaces';
import { createContext, useContext, useState } from 'react';

import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik';
import { FC } from 'react';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: FC = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("What's your name?")
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    password: Yup.string()
      .required(
        'Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &).'
      )
      .min(6, 'Password must be atleast 6 characters.')
      .max(36, "Password can't be more than 36 characters"),
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
    const uri = 'http://127.0.0.1:8000/login';
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      (await res.json()) as RegistrationResponse;
      router.push('/profile');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      // onSubmit={(values, actions) => {
      //   console.log({ values, actions });
      //   alert(JSON.stringify(values, null, 2));
      //   actions.setSubmitting(false);
      // }}
      onSubmit={handleAutorization}
    >
      {({ errors, touched }) => (
        <Form className="mx-auto mt-[160px] flex w-[350px] -translate-y-[70px] flex-col [&>*]:mb-[30px]">
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
          <Button type="submit" text="Log In" />
          <Link className="text-center" href="/signup">
            Sign Up
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
