'use client';
import { FC, useState } from 'react';
import { User } from '@/app/interfaces';
import Button from '@/components/Button';
import { Field, Form, Formik } from 'formik';
// import FieldComponent from './FieldComponent';
import PhotoUpload from './PhotoUpload';
import Modal from '@/components/Modal';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeEmailForm from './ChangeEmailForm';
import GenderCheckBox from './GenderCheckBox';
import FieldComponent from '@/components/FieldComponent';

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  console.log(isOpen);

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
      <div className="mx-auto mt-[50px] max-w-[700px] text-center">
        <Formik
          // validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmitUserFullInformation}
        >
          {/* {({ errors, touched }) => ( */}
          <Form className="[&>*]:mb-[30px]">
            <FieldComponent label="Username" name="username">
              Username
            </FieldComponent>
            <FieldComponent label="First Name" name="first_name">
              First Name
            </FieldComponent>
            <FieldComponent label="Last Name" name="last_name">
              Last Name
            </FieldComponent>
            <div className="flex items-center justify-between">
              <div className="font-bold">Gender</div>
              <GenderCheckBox type="radio" name="gender" />
            </div>
            <FieldComponent label="Biography" name="biography">
              About me
            </FieldComponent>
            <div className="flex items-center justify-between">
              <div className="font-bold">Sexual Preferencies</div>
              <GenderCheckBox type="checkbox" name="gender_preferencies" />
            </div>
            <FieldComponent label="Interests" name="tags">
              use #tags
            </FieldComponent>
            <PhotoUpload user={user} />
            <div>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="font-bold underline"
              >
                Change password
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowAlert(true)}
                className="font-bold underline"
              >
                Change Email
              </button>
            </div>
            <Button type="submit">Confirm</Button>
          </Form>
          {/* )} */}
        </Formik>
        {/* <Button type="submit">Log Out</Button> */}
      </div>

      {isOpen && (
        <Modal handleClose={() => setIsOpen(false)}>
          <ChangePasswordForm handleClose={() => setIsOpen(false)} />
        </Modal>
      )}
      {showAlert && (
        <Modal handleClose={() => setShowAlert(false)}>
          <ChangeEmailForm handleClose={() => setShowAlert(false)} />
        </Modal>
      )}
    </>
  );
};

export default ProfileForm;
