'use client';

import { FC } from 'react';
import { Field, Form, Formik } from 'formik';
import ReactSlider from 'react-slider';

import TagsField from './TagsField';
import Button from './Button';

interface SideBarValue {
  ageRange: number[];
  fameRatingRange: number[];
  locationRange: number[];
  tags: string[];
}

interface SideBarProps {
  currentUser: User;
  className?: string;
}

const SideBar: FC<SideBarProps> = ({ currentUser, className }) => {
  const initialValue: SideBarValue = {
    ageRange: [18, 100],
    fameRatingRange: [0, 5],
    locationRange: [],
    tags: currentUser.tags,
  };

  const Track = (
    props: HTMLPropsWithRefCallback<HTMLDivElement>,
    state: { index: number; value: number[] }
  ) => {
    const { key, ...rest } =
      props as HTMLPropsWithRefCallback<HTMLDivElement> & { key: string };
    return (
      <div
        key={key}
        {...rest}
        className={`absolute bottom-0 left-0 right-full top-0 rounded-xl ${
          state.index === 2
            ? 'bg-neutral/50'
            : state.index === 1
            ? 'bg-brown'
            : 'bg-neutral/50'
        }`}
      ></div>
    );
  };

  const Thumb = (
    props: HTMLPropsWithRefCallback<HTMLDivElement>,
    state: {
      index: number;
      value: number[];
      valueNow: number;
    }
  ) => {
    const { key, ...rest } =
      props as HTMLPropsWithRefCallback<HTMLDivElement> & { key: string };
    return (
      <div
        key={key}
        {...rest}
        className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brown text-xs text-neutral"
      >
        {state.valueNow}
      </div>
    );
  };

  // const handleSearchUsers = () => {
  //   console.log(props);
  // };

  return (
    <div className={`p-4 text-center ${className}`}>
      <Formik
        initialValues={initialValue}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
      >
        {({ setFieldValue }) => (
          <Form className="text-center">
            <div className="mb-5 border-b-2 border-brown pb-1 font-bold">
              Age
            </div>
            <ReactSlider
              className="flex h-[10px] w-full items-center"
              renderTrack={Track}
              renderThumb={Thumb}
              defaultValue={[18, 100]}
              min={18}
              ariaLabel={['Lower thumb', 'Upper thumb']}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling={true}
              minDistance={0}
              onAfterChange={(valueNow: number[]) =>
                void setFieldValue('ageRange', valueNow)
              }
            />
            <div className="mb-5 mt-10 border-b-2 border-brown pb-1 font-bold">
              Fame Rating
            </div>
            <ReactSlider
              className="flex h-[10px] w-full items-center"
              thumbClassName="bg-brown rounded-full text-xs text-neutral h-[30px] w-[30px] flex items-center justify-center"
              renderTrack={Track}
              renderThumb={Thumb}
              defaultValue={[0, 5]}
              max={5}
              ariaLabel={['Lower thumb', 'Upper thumb']}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling={true}
              minDistance={0}
              onAfterChange={(valueNow: number[]) =>
                void setFieldValue('fameRatingRange', valueNow)
              }
            />
            <div className="mb-5 mt-10 border-b-2 border-brown pb-1 font-bold">
              Location
            </div>
            <ReactSlider
              className="flex h-[10px] w-full items-center"
              thumbClassName="bg-brown rounded-full text-xs text-neutral h-[30px] w-[30px] flex items-center justify-center"
              renderTrack={Track}
              renderThumb={Thumb}
              defaultValue={[0, 100]}
              max={100}
              ariaLabel={['Lower thumb', 'Upper thumb']}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling={true}
              minDistance={0}
              onAfterChange={(valueNow: number[]) =>
                void setFieldValue('locationRange', valueNow)
              }
            />
            <div className="mb-5 mt-10 border-b-2 border-brown pb-1 font-bold">
              Interests
            </div>
            <Field
              as={TagsField}
              name="tags"
              className="mb-3"
              onChange={(value: string[]) => setFieldValue('tags', value)}
            />

            <Button
              // loading={isPending}
              // disabled={isPending}
              type="submit"
              className="mx-auto"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SideBar;
