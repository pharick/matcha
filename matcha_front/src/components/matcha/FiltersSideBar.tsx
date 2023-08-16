'use client';

import { FC, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import ReactSlider from 'react-slider';
import { FiFilter } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import TagsField from '../TagsField';
import Button from '../Button';

interface FiltersValues {
  ageRange: number[];
  fameRange: number[];
  distanceRange: number[];
  tags: string[];
}

interface FiltersSideBarProps {
  searchParams: SearchParams;
}

const FiltersSideBar: FC<FiltersSideBarProps> = ({ searchParams }) => {
  const router = useRouter();
  const [hidden, setHidden] = useState(true);

  const initialValues: FiltersValues = {
    ageRange: [searchParams.ageFrom, searchParams.ageTo],
    fameRange: [searchParams.fameFrom, searchParams.fameTo],
    distanceRange: [searchParams.distanceFrom, searchParams.distanceTo],
    tags: searchParams.tags,
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

  const handleSearch = ({
    ageRange,
    fameRange,
    distanceRange,
    tags,
  }: FiltersValues) => {
    const params = new URLSearchParams({
      ageFrom: ageRange[0].toString(),
      ageTo: ageRange[1].toString(),
      fameFrom: fameRange[0].toString(),
      fameTo: fameRange[1].toString(),
      distanceFrom: distanceRange[0].toString(),
      distanceTo: distanceRange[1].toString(),
    });
    router.push(
      `/?${params.toString()}${tags.map((t) => `&tag=${t}`).join('')}`
    );
  };

  return (
    <div className="top-0 z-40 w-full lg:sticky">
      <button
        onClick={() => setHidden((h) => !h)}
        className="flex h-[50px] w-full items-center justify-end font-bold lg:hidden"
      >
        Filters
        {hidden ? (
          <FiFilter color="#403539" className="ml-2" />
        ) : (
          <GrClose color="#403539" className="ml-2" />
        )}
      </button>
      <div className={`p-4 text-center ${hidden && 'hidden'} lg:block`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSearch}
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize={true}
        >
          {({ setFieldValue, values }) => (
            <Form className="text-center">
              <label className="mb-4 block border-b-2 border-brown pb-1 font-bold">
                Age
              </label>
              <ReactSlider
                className="mb-4 flex h-[10px] w-full items-center"
                renderTrack={Track}
                renderThumb={Thumb}
                value={values.ageRange}
                min={18}
                max={100}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling={true}
                minDistance={0}
                onAfterChange={(valueNow) =>
                  void setFieldValue('ageRange', valueNow)
                }
              />
              <label className="mb-4 block border-b-2 border-brown pb-1 font-bold">
                Fame Rating
              </label>
              <ReactSlider
                className="mb-4 flex h-[10px] w-full items-center"
                renderTrack={Track}
                renderThumb={Thumb}
                value={values.fameRange}
                min={0}
                max={5}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling={true}
                minDistance={0}
                onAfterChange={(valueNow) =>
                  void setFieldValue('fameRange', valueNow)
                }
              />
              <label className="mb-4 block border-b-2 border-brown pb-1 font-bold">
                Distance
              </label>
              <ReactSlider
                className="mb-4 flex h-[10px] w-full items-center"
                renderTrack={Track}
                renderThumb={Thumb}
                value={values.distanceRange}
                min={0}
                max={100}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling={true}
                minDistance={0}
                onAfterChange={(valueNow) =>
                  void setFieldValue('distanceRange', valueNow)
                }
              />
              <label className="mb-2 block border-b-2 border-brown pb-1 font-bold">
                Interests
              </label>
              <Field
                as={TagsField}
                name="tags"
                className="mb-2"
                onChange={(value: string[]) => setFieldValue('tags', value)}
              />

              <Button type="submit" className="mx-auto">
                Search
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FiltersSideBar;
