'use client';
import Header from '@/components/Header';
import Button from '@/components/Button';
import * as Yup from 'yup';
import Image from 'next/image';
import LeafDown from '@/images/leafe_down.png';

import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik';
import { NextPage } from 'next';

interface UserSchema {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confPassword: string;
}

const validationSchema = Yup.object({
  userName: Yup.string()
    .required("What's your name?")
    .min(2, 'First name must be between 2 and 16 characters')
    .max(16, 'First name must be between 2 and 16 characters')
    .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
  firstName: Yup.string()
    .required("What's your name?")
    .min(2, 'First name must be between 2 and 16 characters')
    .max(16, 'First name must be between 2 and 16 characters')
    .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
  lastName: Yup.string()
    .required("What's your name?")
    .min(2, 'First name must be between 2 and 16 characters')
    .max(16, 'First name must be between 2 and 16 characters')
    .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
  email: Yup.string()
    .required(
      "You'll need this when you log in and if you ever need to reset your password."
    )
    .email('Enter a valid email address.'),
  password: Yup.string()
    .required(
      'Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &).'
    )
    .min(6, 'Password must be atleast 6 characters.')
    .max(36, "Password can't be more than 36 characters"),
  confPassword: Yup.string()
    .required('Confirm your password.')
    .oneOf([Yup.ref('password')], 'Passwords must match.'),
});

const autorization = async (values: UserSchema) => {
  console.log('AUTORIZATION START');

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      username: values.userName,
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password,
    }),
  };
  const uri = 'http://127.0.0.1:8000/register';
  const res = await fetch(uri, requestOptions).catch((error) => {
    console.log(error);
  });
  const data = await res.json();
  console.log(data);
};

const SignUpPage: NextPage = () => {
  const initialValues: UserSchema = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confPassword: '',
  };

  return (
    <>
      <Header />
      <h1 className="mt-[20px] text-center">Please, fill the form</h1>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        // onSubmit={(values, actions) => {
        //   autorization;
        //   console.log({ values, actions });
        //   alert(JSON.stringify(values, null, 2));
        //   actions.setSubmitting(false);
        // }}
        onSubmit={autorization}
      >
        {({ errors, touched }) => (
          <Form className="absolute left-[50%] top-[50%] mx-auto flex w-[350px] -translate-x-[50%] -translate-y-[50%] flex-col [&>*]:mb-[30px]">
            <Field
              id="username"
              name="userName"
              placeholder="User Name"
              className="block"
            />
            {errors.userName && touched.userName ? (
              <div>{errors.userName}</div>
            ) : null}
            <Field
              id="fistname"
              name="firstName"
              placeholder="First Name"
              className="block"
            />
            {errors.firstName && touched.firstName ? (
              <div>{errors.firstName}</div>
            ) : null}
            <Field
              id="lastname"
              name="lastName"
              placeholder="Last Name"
              className="block"
            />
            {errors.lastName && touched.lastName ? (
              <div>{errors.lastName}</div>
            ) : null}
            <Field
              id="email"
              name="email"
              placeholder="Email"
              className="block"
            />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <Field
              id="password"
              name="password"
              placeholder="password"
              className="block"
            />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <Field
              id="password"
              name="confPassword"
              placeholder="confirm password"
              className="block"
            />
            {errors.confPassword && touched.confPassword ? (
              <div>{errors.confPassword}</div>
            ) : null}
            <Button type="submit" text="Confirm" />
          </Form>
        )}
      </Formik>
      <Image
        className="w-2/2 absolute bottom-0 left-0 -z-50"
        src={LeafDown}
        alt="leaf"
      />
    </>
  );
};

export default SignUpPage;
