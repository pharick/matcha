'use client';

import { FC, useState } from 'react';
import { Form, Formik } from 'formik';

import { User } from '@/interfaces';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import FieldComponent from '@/components/FieldComponent';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeEmailForm from './ChangeEmailForm';
import GenderCheckBox from './GenderCheckBox';

interface ProfileFormProps {
  user: User;
}

interface ProfileFormValues {
  username: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other' | '';
  gender_preferences: ('male' | 'female' | 'other' | '')[];
  biography: string;
  tags: string[];
  image_main: string;
  images?: string[];
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const [changePasswordFormOpen, setChangePasswordFormOpen] =
    useState<boolean>(false);
  const [changeEmailFormOpen, setChangeEmailFormOpen] =
    useState<boolean>(false);

  const initialValues: ProfileFormValues = {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    gender: 'female',
    gender_preferences: [''],
    biography: '',
    tags: [''],
    image_main: '',
    images: [''],
  };

  const handleSubmitUserFullInformation = async (values: ProfileFormValues) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const requestOptions = {
      method: 'PATCH',
      body: JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        biography: values.biography,
        tags: [],
      }),
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const uri = `/api/users/${user.username}`;
    const res = await fetch(uri, requestOptions);
    console.log(await res.json());
    if (res.ok) {
      console.log(res);
    }
  };

  return (
    <>
      <section className="mb-5">
        <Formik
          // validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmitUserFullInformation}
        >
          {/* {({ errors, touched }) => ( */}
          <Form className="text-center">
            <FieldComponent
              type="text"
              label="Username"
              name="username"
              className="mb-3"
            >
              Username
            </FieldComponent>
            <FieldComponent
              type="text"
              label="First Name"
              name="first_name"
              className="mb-3"
            >
              First Name
            </FieldComponent>
            <FieldComponent
              type="text"
              label="Last Name"
              name="last_name"
              className="mb-3"
            >
              Last Name
            </FieldComponent>
            <div className="mb-3 flex items-center justify-between">
              <div className="font-bold">Gender</div>
              <GenderCheckBox type="radio" name="gender" />
            </div>
            <FieldComponent
              type="text"
              label="Biography"
              name="biography"
              className="mb-3"
            >
              About me
            </FieldComponent>
            <div className="mb-3 flex items-center justify-between">
              <div className="font-bold">Sexual Preferencies</div>
              <GenderCheckBox type="checkbox" name="gender_preferencies" />
            </div>
            <FieldComponent
              type="text"
              label="Interests"
              name="tags"
              className="mb-3"
            >
              use #tags
            </FieldComponent>

            <div>
              <button
                type="button"
                onClick={() => setChangePasswordFormOpen(true)}
                className="font-bold underline"
              >
                Change password
              </button>
            </div>
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setChangeEmailFormOpen(true)}
                className="font-bold underline"
              >
                Change Email
              </button>
            </div>
            <Button type="submit" className="mx-auto">
              Save
            </Button>
          </Form>
          {/* )} */}
        </Formik>
      </section>

      <Modal
        isOpen={changePasswordFormOpen}
        handleClose={() => setChangePasswordFormOpen(false)}
      >
        <ChangePasswordForm
          handleClose={() => setChangePasswordFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={changeEmailFormOpen}
        handleClose={() => setChangeEmailFormOpen(false)}
      >
        <ChangeEmailForm handleClose={() => setChangeEmailFormOpen(false)} />
      </Modal>
    </>
  );
};

export default ProfileForm;
