import { FC } from 'react';
import { Field, Form, Formik } from 'formik';
import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';

interface ChangeEmailFormProps {
  handleClose: () => void;
}

interface ChangeEmailFormValues {
  password: string;
}

const ChangeEmailForm: FC<ChangeEmailFormProps> = ({ handleClose }) => {
  const initialValues: ChangeEmailFormValues = {
    password: '',
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
    if (res.ok) {
      handleClose();
    }
  };
  return (
    <>
      <h1 className="mb-7 mt-1 text-center font-bold">
        You gonna change your e-mail, please, write your password to change it:
      </h1>
      <Formik
        // validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangeEmail}
      >
        {/* {({ errors, touched }) => ( */}
        <Form className="[&>*]:mb-[30px]">
          <FieldComponent type="password" name="password" className="mb-3">
            Password
          </FieldComponent>
          <Button className="m-auto block" type="submit">
            Confirm
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default ChangeEmailForm;
