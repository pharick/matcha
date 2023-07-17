'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { BiRightArrowAlt } from 'react-icons/bi';

import Button from '@/components/Button';
import { RegistrationResponse } from '@/interfaces';
import FieldComponent from '@/components/FieldComponent';
import Modal from '@/components/Modal';
import ResetPasswordForm from './ResetPasswordForm';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: FC = () => {
  const router = useRouter();
  const [passwordResetModalOpen, setPasswordResetModalOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

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
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched }) => (
          <Form className="relative mx-auto flex flex-col">
            <FieldComponent
              type="text"
              name="username"
              errors={errors.username}
              touched={touched.username}
              className="mb-[30px]"
            >
              username
            </FieldComponent>
            <FieldComponent
              type="password"
              name="password"
              errors={errors.password}
              touched={touched.password}
              className="mb-[30px]"
            >
              password
            </FieldComponent>
            <Button type="submit" className="mb-[20px]">
              Log In
            </Button>
            <Link
              className="font-semi-bold group mb-[20px] flex items-center justify-center rounded-[20px] border-2 border-transparent p-[5px] text-[22px] hover:border-2 hover:border-brown"
              href="/signup"
            >
              <div className="relative w-fit">
                Sign Up
                <BiRightArrowAlt
                  size={30}
                  className="absolute left-full top-0.5 hidden group-hover:block"
                />
              </div>
            </Link>
          </Form>
        )}
      </Formik>

      <button
        type="button"
        onClick={() => setPasswordResetModalOpen(true)}
        className="mx-auto block font-bold underline hover:opacity-80"
      >
        I forgot my password
      </button>

      <Modal
        isOpen={passwordResetModalOpen}
        handleClose={() => setPasswordResetModalOpen(false)}
      >
        <ResetPasswordForm
          handleClose={() => setPasswordResetModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default LoginForm;
