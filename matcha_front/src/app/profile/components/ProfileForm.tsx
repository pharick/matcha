'use client';

import { FC, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

import { User } from '@/interfaces';
import RadioButton from '@/components/RadioButton';
import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Checkbox from '@/components/CheckBox';
import { sleep } from '@/helpers';
import TagsField from '@/components/TagsField';

interface ProfileFormProps {
  user: User;
}

interface ProfileFormValues {
  username: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | '';
  genderPreferences: ('male' | 'female' | 'other' | '')[];
  biography: string;
  tags: string[];
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: ProfileFormValues = {
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    gender: user.gender,
    genderPreferences: user.gender_preferences,
    biography: user.biography,
    tags: user.tags,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Can not be blank'),
    firstName: Yup.string()
      .required('Can not be blank')
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    lastName: Yup.string()
      .required('Can not be blank')
      .min(2, 'Last name must be between 2 and 16 characters')
      .max(16, 'Last name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    biography: Yup.string().max(
      200,
      'Biography must be not more than 200 characters'
    ),
    tags: Yup.array().of(Yup.string()),
    gender: Yup.string()
      .required('Please choose your gender')
      .oneOf(['male', 'female', 'other']),
    genderPreferences: Yup.array()
      .required('Choose at least one')
      .min(1, 'Choose at least 1 gender preferences'),
  });

  const handleSubmitUserFullInformation = async (values: ProfileFormValues) => {
    setIsLoading(true);
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const requestOptions = {
      method: 'PATCH',
      body: JSON.stringify({
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        gender_preferences: values.genderPreferences,
        biography: values.biography,
        tags: values.tags,
      }),
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const uri = `/api/users/${user.username}`;
    const res = await fetch(uri, requestOptions);
    await sleep(500);
    if (res.ok) router.push(`/users/${user.username}`);
    setIsLoading(false);
  };

  return (
    <>
      <section className="mb-5">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmitUserFullInformation}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="text-center">
              <FieldComponent
                type="text"
                label="Username"
                name="username"
                className="mb-3"
                disabled={true}
                errors={errors.username}
                touched={touched.username}
              >
                Username
              </FieldComponent>
              <FieldComponent
                type="text"
                label="First Name"
                name="firstName"
                className="mb-3"
                errors={errors.firstName}
                touched={touched.firstName}
              >
                First Name
              </FieldComponent>
              <FieldComponent
                type="text"
                label="Last Name"
                name="lastName"
                className="mb-3"
                errors={errors.lastName}
                touched={touched.lastName}
              >
                Last Name
              </FieldComponent>
              <FieldComponent
                type="textarea"
                label="Biography"
                name="biography"
                className="mb-3"
                errors={errors.biography}
                touched={touched.biography}
              >
                About me
              </FieldComponent>

              <label htmlFor="tags" className="font-bold">
                Interests
              </label>
              <Field
                as={TagsField}
                name="tags"
                className="mb-3"
                onChange={(value: string[]) => setFieldValue('tags', value)}
              />

              <div className="mb-3 ">
                <div className="flex items-center justify-between">
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
                {errors.gender && touched.gender ? (
                  <div className="py-1 text-center text-sm text-pink-800">
                    {errors.gender}
                  </div>
                ) : null}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Gender preferences</h3>
                  <div className="flex">
                    <Checkbox name="genderPreferences" value="male">
                      Male
                    </Checkbox>
                    <Checkbox name="genderPreferences" value="female">
                      Female
                    </Checkbox>
                    <Checkbox name="genderPreferences" value="other">
                      Other
                    </Checkbox>
                  </div>
                </div>
                {errors.genderPreferences && touched.genderPreferences ? (
                  <div className="py-1 text-center text-sm text-pink-800">
                    {errors.genderPreferences}
                  </div>
                ) : null}
              </div>

              <Button
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                className="mx-auto"
              >
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
};

export default ProfileForm;
