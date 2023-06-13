'use client';
import Button from '@/components/Button';
import Link from 'next/link';

import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik';

interface MyFormValues {
  email: string;
  password: string;
}

const LogIn = () => {
  const initialValues: MyFormValues = { email: '', password: '' };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        console.log({ values, actions });
        alert(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
      }}
    >
      <Form className="mx-auto mt-[160px] flex w-[350px] -translate-y-[70px] flex-col [&>*]:mb-[30px]">
        <Field id="email" name="email" placeholder="email" className="block" />
        <Field
          id="password"
          name="password"
          placeholder="password"
          className="block"
        />
        <Button type="submit" text="Log In" />
        <Link className="text-center" href="/signup">
          Sign Up
        </Link>
      </Form>
    </Formik>
  );
};

export default LogIn;
