'use client';

import { FC, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import FieldComponent from '@/components/FieldComponent';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import { signUp } from '@/api/auth';
import { differenceInYears } from 'date-fns';
import Link from 'next/link';

type SignUpFormValues = SignUpData & { conf_password: string };

const SignUpForm: FC = () => {
  const [isValid, setIsValid] = useState(true);

  const passwordRequiremets =
    'Password shoud be at least six characters long and contain at least one number, lowercase and uppercase letter and punctuation mark (such as ! and &)';

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("What's your username?")
      .min(2, 'Username must be between 2 and 16 characters')
      .max(16, 'Username must be between 2 and 16 characters')
      .matches(/^[aA-zZ]*$/, 'Numbers and special characters are not allowed'),
    first_name: Yup.string()
      .required("What's your first name?")
      .min(1, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]*$/, 'Numbers and special characters are not allowed'),
    last_name: Yup.string()
      .required("What's your last name?")
      .min(1, 'Last name must be between 2 and 16 characters')
      .max(16, 'Last name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]*$/, 'Numbers and special characters are not allowed'),
    birth_date: Yup.date()
      .nullable()
      .test('DOB', 'This website for 18+ only', (value) => {
        if (value) return differenceInYears(new Date(), value) >= 18;
      }),
    email: Yup.string()
      .required("You'll need this when if you ever forgot your password")
      .email('Enter a valid email address'),
    password: Yup.string()
      .required(passwordRequiremets)
      .min(6, passwordRequiremets)
      .max(36, "Password can't be more than 36 characters")
      .matches(/[0-9]/, passwordRequiremets)
      .matches(/[a-z]/, passwordRequiremets)
      .matches(/[A-Z]/, passwordRequiremets)
      .matches(/[.#!$%^&*;:{}\-_~()]/, passwordRequiremets),
    conf_password: Yup.string()
      .required('Confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords does not match'),
  });

  const handleAutorization = async (values: SignUpFormValues) => {
    setIsValid(true);
    const user = await signUp(values);
    if (!user) setIsValid(false);
  };

  const initialValues: SignUpFormValues = {
    username: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    password: '',
    conf_password: '',
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleAutorization}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          {!isValid && (
            <Alert type="error" className="mb-5">
              Username or email is already in use
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
            type="text"
            name="first_name"
            errors={errors.first_name}
            touched={touched.first_name}
            className="mb-5"
          >
            First Name
          </FieldComponent>

          <FieldComponent
            type="text"
            name="last_name"
            errors={errors.last_name}
            touched={touched.last_name}
            className="mb-5"
          >
            Last Name
          </FieldComponent>

          <FieldComponent
            type="text"
            name="email"
            errors={errors.email}
            touched={touched.email}
            className="mb-5"
          >
            Email
          </FieldComponent>

          <FieldComponent
            type="date"
            name="birth_date"
            errors={errors.birth_date}
            touched={touched.birth_date}
            className="mb-5"
          >
            Birth Date
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

          <FieldComponent
            type="password"
            name="conf_password"
            errors={errors.conf_password}
            touched={touched.conf_password}
            className="mb-5"
          >
            Confirm Password
          </FieldComponent>

          <Button
            className="mx-auto"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Confirm
          </Button>
          <Link
            className="mt-5 flex justify-center  font-bold underline hover:opacity-80"
            href="/login"
          >
            Back to login page
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
