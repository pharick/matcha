import Button from '@/components/Button';
import { Field, Form, Formik } from 'formik';
import { FC } from 'react';

interface ChangePasswordFormProps {
  handleClose: () => void;
}

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confNewPassword: string;
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ handleClose }) => {
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
    if (res.ok) {
      handleClose();
    }
  };
  return (
    <>
      <Formik
        // validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
      >
        {/* {({ errors, touched }) => ( */}
        <Form className="[&>*]:mb-[30px]">
          <Field
            id="oldPassword"
            name="oldPassword"
            placeholder="Old Password"
            className="block w-full"
          />
          <Field
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            className="block w-full"
          />
          <Field
            id="confNewPassword"
            name="confNewPassword"
            placeholder="Confirm New Password"
            className="block w-full"
          />
          <Button type="submit">Confirm</Button>
        </Form>
      </Formik>
    </>
  );
};

export default ChangePasswordForm;
