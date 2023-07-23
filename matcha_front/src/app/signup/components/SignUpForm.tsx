'use client';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikHelpers } from 'formik';

import FieldComponent from '@/components/FieldComponent';
import Button from '@/components/Button';
import { RegistrationResponse } from '@/interfaces';
import { sleep } from '@/helpers';

interface SignUpFormValues {
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confPassword: string;
}

const SignUpForm: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequiremets =
    'Password shoud be at least six characters long and contain at least one number, letter and punctuation mark (such as ! and &)';

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("What's your username?")
      .min(2, 'Username must be between 2 and 16 characters')
      .max(16, 'Username must be between 2 and 16 characters')
      .matches(/^[aA-zZ]*$/, 'Numbers and special characters are not allowed'),
    firstName: Yup.string()
      .required("What's your first name?")
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]*$/, 'Numbers and special characters are not allowed'),
    lastName: Yup.string()
      .required("What's your last name?")
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]*$/, 'Numbers and special characters are not allowed'),
    birthDate: Yup.date().required('Enter your birth date'),
    email: Yup.string()
      .required("You'll need this when if you ever forgot your password")
      .email('Enter a valid email address'),
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

  const handleAutorization = async (
    values: SignUpFormValues,
    { setFieldError }: FormikHelpers<SignUpFormValues>
  ) => {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        username: values.username.toLowerCase(),
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: values.birthDate,
        email: values.email.toLowerCase(),
        password: values.password,
      }),
    };
    const uri = `/api/register`;
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      const data = (await res.json()) as RegistrationResponse;
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } else if (res.status == 409) {
      setFieldError('username', 'This username is already in use');
    }
    await sleep(500);
    setIsLoading(false);
  };

  const initialValues: SignUpFormValues = {
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: '',
    confPassword: '',
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleAutorization}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, touched }) => (
        <Form>
          <FieldComponent
            type="text"
            name="username"
            errors={errors.username}
            touched={touched.username}
            className="mb-[30px]"
          >
            Username
          </FieldComponent>
          <FieldComponent
            type="text"
            name="firstName"
            errors={errors.firstName}
            touched={touched.firstName}
            className="mb-[30px]"
          >
            First Name
          </FieldComponent>
          <FieldComponent
            type="text"
            name="lastName"
            errors={errors.lastName}
            touched={touched.lastName}
            className="mb-[30px]"
          >
            Last Name
          </FieldComponent>
          <FieldComponent
            type="text"
            name="email"
            errors={errors.email}
            touched={touched.email}
            className="mb-[30px]"
          >
            Email
          </FieldComponent>
          <FieldComponent
            type="date"
            name="birthDate"
            errors={errors.birthDate}
            touched={touched.birthDate}
            className="mb-[30px]"
          >
            Birth Date
          </FieldComponent>
          <FieldComponent
            type="password"
            name="password"
            errors={errors.password}
            touched={touched.password}
            className="mb-[30px]"
          >
            Password
          </FieldComponent>
          <FieldComponent
            type="password"
            name="confPassword"
            errors={errors.confPassword}
            touched={touched.confPassword}
            className="mb-[30px]"
          >
            Confirm Password
          </FieldComponent>
          <Button className="mx-auto" type="submit" loading={isLoading}>
            Confirm
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
