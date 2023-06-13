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

interface userSchema {
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

const SignUp = () => {
  const initialValues: userSchema = {
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
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        <Form className="absolute left-[50%] top-[50%] mx-auto flex w-[350px] -translate-x-[50%] -translate-y-[50%] flex-col [&>*]:mb-[30px]">
          <Field
            id="username"
            name="userName"
            placeholder="User Name"
            className="block"
          />
          <Field
            id="fistname"
            name="firstName"
            placeholder="First Name"
            className="block"
          />
          <Field
            id="lastname"
            name="lastName"
            placeholder="Last Name"
            className="block"
          />
          <Field
            id="email"
            name="email"
            placeholder="Email"
            className="block"
          />
          <Field
            id="password"
            name="password"
            placeholder="password"
            className="block"
          />
          <Button type="submit" text="Confirm" />
        </Form>
      </Formik>
      <Image
        className="w-2/2 absolute bottom-0 left-0 -z-50"
        src={LeafDown}
        alt="leaf"
      />
    </>
  );
};

export default SignUp;
