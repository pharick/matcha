'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';
import * as Yup from 'yup';
import { RegistrationResponse } from '@/app/interfaces';
import { Formik, Form, Field } from 'formik';
import { FC, useState } from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';

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
            <Field
              id="username"
              name="username"
              placeholder="username"
              className="block"
            />
            {errors.username && touched.username ? (
              <div className="-mt-[30px] text-center text-pink-800">
                {errors.username}
              </div>
            ) : null}
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="password"
              className="block"
            />
            {errors.password && touched.password ? (
              <div className="-mt-[30px] text-center text-pink-800">
                {errors.password}
              </div>
            ) : null}
            <Button type="submit">Log In</Button>
            <div className="flex items-center w-full rounded-[20px] justify-center p-[5px] hover:border-2 hover:border-brown">
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
