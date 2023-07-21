import { FC } from 'react';
import { Form, Formik } from 'formik';

import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';

interface ChangeEmailFormValues {
  password: string;
  email: string;
}

const ChangeEmailForm: FC = () => {
  const initialValues: ChangeEmailFormValues = {
    password: '',
    email: '',
  };

  const handleChangeEmail = async (values: ChangeEmailFormValues) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        password: values.password,
      }),
      headers: { Authorization: `Bearer ${userToken}` },
    };
    const uri = `/api/password_change`;
    const res = await fetch(uri, requestOptions);
  };
  return (
    <>
      <h3 className="my-5 border-b-2 border-brown pb-1 text-center text-xl text-brown">
        Change email
      </h3>
      <Formik
        // validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangeEmail}
      >
        {/* {({ errors, touched }) => ( */}
        <Form>
          <FieldComponent type="email" name="email" className="mb-3">
            Email
          </FieldComponent>
          <FieldComponent type="password" name="password" className="mb-3">
            Password
          </FieldComponent>
          <Button className="ml-auto" type="submit">
            Confirm
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default ChangeEmailForm;
