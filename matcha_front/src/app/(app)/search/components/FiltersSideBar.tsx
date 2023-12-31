'use client';

import { FC, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import ReactSlider from 'react-slider';
import { FiFilter } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';

import TagsField from '../../../../components/TagsField';
import SortingField from './SortingField';
import { SortType, sortFields } from './Matcha';

interface FiltersValues {
  ageRange: number[];
  minFame: number;
  maxDistance: number;
  tags: string[];
  sort: { field: string; type: SortType };
}

interface FiltersSideBarProps {
  searchParams: SearchParams;
}

const FiltersSideBar: FC<FiltersSideBarProps> = ({ searchParams }) => {
  const router = useRouter();
  const [hidden, setHidden] = useState(true);

  const initialValues: FiltersValues = {
    ageRange: [searchParams.ageFrom, searchParams.ageTo],
    minFame: searchParams.minFame,
    maxDistance: searchParams.maxDistance,
    tags: searchParams.tags,
    sort: {
      field: Object.keys(sortFields).includes(searchParams.sortField)
        ? searchParams.sortField
        : 'distance',
      type:
        searchParams.sortType == 'desc'
          ? SortType.Descending
          : SortType.Ascending,
    },
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
            : state.index === 1 && state.value.length > 1
            ? 'bg-brown'
            : 'bg-neutral/50'
        }`}
      ></div>
    );
  };

  function getThumb(showValue: boolean) {
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
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-brown text-xs text-neutral"
        >
          {showValue && state.valueNow}
        </div>
      );
    };
    return Thumb;
  }

  const handleSearch = ({
    ageRange,
    minFame,
    maxDistance,
    tags,
    sort,
  }: FiltersValues) => {
    const params = new URLSearchParams({
      ageFrom: ageRange[0].toString(),
      ageTo: ageRange[1].toString(),
      minFame: minFame.toString(),
      maxDistance: maxDistance.toString(),
      sortField: sort.field,
      sortType: sort.type,
    });
    router.replace(
      `/search/?${params.toString()}${tags.map((t) => `&tag=${t}`).join('')}`
    );
  };

  return (
    <div className="top-0 z-40 w-full overflow-y-auto lg:sticky">
      <button
        onClick={() => setHidden((h) => !h)}
        className="flex h-[50px] w-full items-center justify-end font-bold lg:hidden"
      >
        Filters & Sorting
        {hidden ? (
          <FiFilter color="#403539" className="ml-2" />
        ) : (
          <GrClose color="#403539" className="ml-2" />
        )}
      </button>
      <div className={`p-4 ${hidden && 'hidden'} h-screen lg:block`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSearch}
          validateOnBlur={false}
          validateOnChange={true}
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
                renderThumb={getThumb(true)}
                value={values.ageRange}
                min={18}
                max={100}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling={true}
                minDistance={0}
                onChange={(valueNow) =>
                  void setFieldValue('ageRange', valueNow)
                }
                onAfterChange={(valueNow) =>
                  handleSearch({ ...values, ageRange: valueNow })
                }
              />

              <label className="mb-4 block border-b-2 border-brown pb-1 font-bold">
                Minimum Fame Rating
              </label>
              <ReactSlider
                className="mb-4 flex h-[10px] w-full items-center"
                renderTrack={Track}
                renderThumb={getThumb(true)}
                defaultValue={[values.minFame]}
                min={0}
                max={5}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling={true}
                minDistance={0}
                onChange={(valueNow) => void setFieldValue('minFame', valueNow)}
                onAfterChange={(valueNow) =>
                  handleSearch({
                    ...values,
                    minFame: valueNow as unknown as number,
                  })
                }
              />

              <label className="mb-4 block border-b-2 border-brown pb-1 font-bold">
                Maximum Distance — {values.maxDistance}km
              </label>
              <ReactSlider
                className="mb-4 flex h-[10px] w-full items-center"
                renderTrack={Track}
                renderThumb={getThumb(false)}
                value={[values.maxDistance]}
                min={1}
                max={10000}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling={true}
                minDistance={0}
                onChange={(valueNow) =>
                  void setFieldValue('maxDistance', valueNow)
                }
                onAfterChange={(valueNow) =>
                  handleSearch({
                    ...values,
                    maxDistance: valueNow as unknown as number,
                  })
                }
              />

              <label className="mb-2 block border-b-2 border-brown pb-1 font-bold">
                Sort by
              </label>
              <SortingField
                value={values.sort}
                fields={Object.keys(sortFields)}
                onChange={(v) => {
                  void setFieldValue('sort', v);
                  handleSearch({ ...values, sort: v });
                }}
                className="mb-4"
              />

              {values.sort.field == 'specific_interests' && (
                <>
                  <label className="mb-2 block border-b-2 border-brown pb-1 font-bold">
                    Interests
                  </label>
                  <Field
                    as={TagsField}
                    name="tags"
                    className="mb-2"
                    onChange={(value: string[]) => {
                      void setFieldValue('tags', value);
                      handleSearch({
                        ...values,
                        tags: value,
                      });
                    }}
                  />
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FiltersSideBar;
