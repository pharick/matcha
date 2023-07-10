'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';
import * as Yup from 'yup';
import { RegistrationResponse } from '@/app/interfaces';
import { Formik, Form, Field } from 'formik';
import { FC, useState } from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
// import FieldComponent from './FieldComponent';
import FieldComponent from '@/components/FieldComponent';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: FC = () => {
  const router = useRouter();
  const [hovered, setHovered] = useState<boolean>(false);

  const validationSchema = Yup.object({
    username: Yup.string().required("What's your username?"),
    password: Yup.string().required('Enter your password'),
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
          <Form className="relative  mx-auto flex flex-col [&>*]:mb-[30px]">
            <FieldComponent
              name="username"
              errors={errors.username}
              touched={touched.username}
            >
              username
            </FieldComponent>
            <FieldComponent
              name="password"
              errors={errors.password}
              touched={touched.password}
            >
              password
            </FieldComponent>
            <Button type="submit">Log In</Button>
            <div className="flex w-full items-center justify-center rounded-[20px] p-[5px] hover:border-2 hover:border-brown">
              <Link
                className="font-semi-bold text-[28px] "
                href="/signup"
                onMouseOver={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                Sign Up
              </Link>
              {hovered && <BiRightArrowAlt size={30} className="ml-[10px]" />}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
