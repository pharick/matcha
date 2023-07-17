'use client';

import { FC } from 'react';
import { Field, Form, Formik } from 'formik';

import { User } from '@/interfaces';
import RadioButton from '@/components/RadioButton';
import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Checkbox from '@/components/CheckBox';

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
            <FieldComponent
              type="text"
              label="Biography"
              name="biography"
              className="mb-3"
            >
              About me
            </FieldComponent>
            <FieldComponent
              type="text"
              label="Interests"
              name="tags"
              className="mb-3"
            >
              use #tags
            </FieldComponent>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Gender</h3>
              <div className="flex rounded-md border border-brown">
                <RadioButton name="gender" value="male">
                  Male
                </RadioButton>
                <RadioButton name="gender" value="female">
                  Female
                </RadioButton>
                <RadioButton name="gender" value="other">
                  Other
                </RadioButton>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Sexual preferences</h3>
              <div className="flex">
                <Checkbox name="sex-preferences" value="male">
                  Male
                </Checkbox>
                <Checkbox name="sex-preferences" value="female">
                  Female
                </Checkbox>
                <Checkbox name="sex-preferences" value="other">
                  Other
                </Checkbox>
              </div>
            </div>

            <Button type="submit" className="mx-auto">
              Save
            </Button>
          </Form>
          {/* )} */}
        </Formik>
      </section>
    </>
  );
};

export default ProfileForm;
