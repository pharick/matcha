'use client';

import { FC, useTransition } from 'react';
import { revalidateTag } from 'next/cache';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import RadioButton from '@/components/RadioButton';
import Button from '@/components/Button';
import FieldComponent from '@/components/FieldComponent';
import Checkbox from '@/components/CheckBox';
import TagsField from '@/components/TagsField';
import { updateProfile } from '@/api/profile';

interface ProfileFormProps {
  user: User;
}

type ProfileFormValues = ProfileDataBase & {
  username: string;
  gender: Gender | '';
};

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const [isPending, startTransition] = useTransition();

  const initialValues: ProfileFormValues = {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    gender: user.gender,
    gender_preferences: user.gender_preferences,
    biography: user.biography,
    tags: user.tags,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Can not be blank'),
    first_name: Yup.string()
      .required('Can not be blank')
      .min(2, 'First name must be between 2 and 16 characters')
      .max(16, 'First name must be between 2 and 16 characters')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed '),
    last_name: Yup.string()
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
    gender_preferences: Yup.array()
      .required('Choose at least one')
      .min(1, 'Choose at least 1 gender preferences'),
  });

  const handleSubmitUserFullInformation = (values: ProfileFormValues) => {
    startTransition(
      () =>
        void updateProfile(values.username, {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender || 'other',
          gender_preferences: values.gender_preferences,
          biography: values.biography,
          tags: values.tags,
        })
    );
    revalidateTag('profile');
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmitUserFullInformation}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
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
            name="first_name"
            className="mb-3"
            errors={errors.first_name}
            touched={touched.first_name}
          >
            First Name
          </FieldComponent>

          <FieldComponent
            type="text"
            label="Last Name"
            name="last_name"
            className="mb-3"
            errors={errors.last_name}
            touched={touched.last_name}
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

          <div className="mb-3">
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
            {errors.gender && touched.gender && (
              <div className="py-1 text-center text-sm text-pink-800">
                {errors.gender}
              </div>
            )}
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Gender preferences</h3>
              <div className="flex">
                <Checkbox name="gender_preferences" value="male">
                  Male
                </Checkbox>
                <Checkbox name="gender_preferences" value="female">
                  Female
                </Checkbox>
                <Checkbox name="gender_preferences" value="other">
                  Other
                </Checkbox>
              </div>
            </div>
            {errors.gender_preferences && touched.gender_preferences && (
              <div className="py-1 text-center text-sm text-pink-800">
                {errors.gender_preferences}
              </div>
            )}
          </div>

          <Button
            loading={isPending}
            disabled={isPending}
            type="submit"
            className="mx-auto"
          >
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
