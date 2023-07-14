'use client';
import Button from '@/components/Button';
import * as Yup from 'yup';
import FieldComponent from '@/components/FieldComponent';

import { Formik, Form } from 'formik';
import { RegistrationResponse } from '../../interfaces';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface SignUpFormValues {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confPassword: string;
}

const SignUpForm: FC = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("What's your name?")
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    firstName: Yup.string()
      .required("What's your First name?")
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    lastName: Yup.string()
      .required("What's your Last name?")
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

  const handleAutorization = async (values: SignUpFormValues) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
      }),
    };
    console.log(requestOptions.body);
    const uri = `/api/register`;
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      const data = (await res.json()) as RegistrationResponse;
      localStorage.setItem('token', data.token);
      router.push('/profile');
    }
  };

  const initialValues: SignUpFormValues = {
    username: '',
    firstName: '',
    lastName: '',
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
    >
      {({ errors, touched }) => (
        <Form className="max-w-[600px] flex-1">
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
            type="email"
            name="email"
            errors={errors.email}
            touched={touched.email}
            className="mb-[30px]"
          >
            Email
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
          <Button className="mx-auto" type="submit">
            Confirm
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
