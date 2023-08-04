'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { FC, useState } from 'react';
import * as Yup from 'yup';

import FieldComponent from '@/components/FieldComponent';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import { changePassword } from '@/api/auth';

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confNewPassword: string;
}

const ChangePasswordForm: FC = () => {
  const [result, setResult] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  const initialValues: ChangePasswordFormValues = {
    oldPassword: '',
    newPassword: '',
    confNewPassword: '',
  };

  const passwordRequiremets =
    'Password shoud be at least six characters long and contain at least one number, letter and punctuation mark (such as ! and &)';

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Enter your old password'),
    newPassword: Yup.string()
      .required(passwordRequiremets)
      .min(6, 'Password must be atleast 6 characters')
      .max(36, "Password can't be more than 36 characters")
      .matches(/[0-9]/, passwordRequiremets)
      .matches(/[a-z]/, passwordRequiremets)
      .matches(/[A-Z]/, passwordRequiremets)
      .matches(/[.#!$%^&*;:{}\-_~()]/, passwordRequiremets),
    confNewPassword: Yup.string()
      .required('Confirm your password')
      .oneOf([Yup.ref('newPassword')], 'Passwords does not match'),
  });

  const handleChangePassword = async (
    values: ChangePasswordFormValues,
    { resetForm }: FormikHelpers<ChangePasswordFormValues>
  ) => {
    const user = await changePassword(values.oldPassword, values.newPassword);
    setResult(true);
    if (!user) setIsValid(false);
    else {
      setIsValid(true);
      resetForm();
    }
  };

  return (
    <>
      <h3 className="my-5 border-b-2 border-brown pb-1 text-center text-xl text-brown">
        Change password
      </h3>
      {result && isValid && (
        <Alert type="success" className="mb-3">
          Password is changed
        </Alert>
      )}
      {result && !isValid && (
        <Alert type="error" className="mb-3">
          Invalid old password
        </Alert>
      )}
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleChangePassword}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <FieldComponent
              type="password"
              name="oldPassword"
              className="mb-3"
              errors={errors.oldPassword}
              touched={touched.oldPassword}
            >
              Old Password
            </FieldComponent>
            <FieldComponent
              type="password"
              name="newPassword"
              className="mb-3"
              errors={errors.newPassword}
              touched={touched.newPassword}
            >
              New Password
            </FieldComponent>
            <FieldComponent
              type="password"
              name="confNewPassword"
              className="mb-3"
              errors={errors.confNewPassword}
              touched={touched.confNewPassword}
            >
              Confirm New Password
            </FieldComponent>
            <Button
              className="ml-auto"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangePasswordForm;
