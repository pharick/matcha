import Button from '@/components/Button';
import { Form, Formik } from 'formik';
import { FC } from 'react';
import FieldComponent from '@/components/FieldComponent';

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confNewPassword: string;
}

const ChangePasswordForm: FC<> = () => {
  const initialValues: ChangePasswordFormValues = {
    oldPassword: '',
    newPassword: '',
    confNewPassword: '',
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        old_password: values.oldPassword,
        new_password: values.newPassword,
      }),
      headers: { Authorization: `Bearer ${userToken}` },
    };
    const uri = `/api/password_change`;
    const res = await fetch(uri, requestOptions);
    // if (res.ok) {
    //   handleClose();
    // }
  };
  return (
    <>
      <div className="my-5 border-b-2 border-brown pb-1 text-center text-xl text-brown">
        Change password
      </div>
      <Formik
        // validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
      >
        {/* {({ errors, touched }) => ( */}
        <Form>
          <FieldComponent type="password" name="oldPassword" className="mb-3">
            Old Password
          </FieldComponent>
          <FieldComponent type="password" name="newPassword" className="mb-3">
            New Password
          </FieldComponent>
          <FieldComponent
            type="password"
            name="confNewPassword"
            className="mb-3"
          >
            Confirm New Password
          </FieldComponent>
          <Button className="ml-auto" type="submit">
            Confirm
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default ChangePasswordForm;
