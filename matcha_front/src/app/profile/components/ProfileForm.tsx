'use client';
import { FC } from 'react';
import { User } from '@/app/interfaces';
import Button from '@/components/Button';
import { Field, Form, Formik } from 'formik';
import FieldComponent from './FieldComponent';

interface ProfileFormProps {
  user: User;
}

interface ProfileFormValues {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: 'male' | 'female' | 'other' | 'none';
  gender_preferences: ('male' | 'female' | 'other' | 'none')[];
  biography?: string;
  tags: string[];
  image_main: string;
  images?: string[];
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const initialValues: ProfileFormValues = {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    gender: 'none',
    gender_preferences: ['none'],
    biography: '',
    tags: [''],
    image_main: '',
    images: [''],
  };
  return (
    <div className="flex">
      <div className="w-full"></div>
      <div className="w-full text-center">
        <Formik
          // validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            console.log({ values, actions });
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }}
          // onSubmit={handleAutorization}
        >
          {/* {({ errors, touched }) => ( */}
          <Form className="[&>*]:mb-[30px]">
            <FieldComponent field="username">Username</FieldComponent>
            <FieldComponent field="first_name">First Name</FieldComponent>
            <FieldComponent field="last_name">Last Name</FieldComponent>
            <FieldComponent field="email">email</FieldComponent>
            <div role="group" aria-labelledby="checkbox-group">
              <label>
                <Field type="checkbox" name="checked" value="One" />
                Male
              </label>
              <label>
                <Field type="checkbox" name="checked" value="Two" />
                Female
              </label>
              <label>
                <Field type="checkbox" name="checked" value="Three" />
                Other
              </label>
            </div>
            <FieldComponent field="biography">About me</FieldComponent>
            <FieldComponent field="tags">Tags #</FieldComponent>
            <Button type="submit">Confirm</Button>
          </Form>
          {/* )} */}
        </Formik>
        <Button type="submit">Log Out</Button>
      </div>
    </div>
  );
};

export default ProfileForm;
