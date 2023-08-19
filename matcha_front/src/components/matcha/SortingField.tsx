import { FC } from 'react';

import { GoSortAsc, GoSortDesc } from 'react-icons/go';

export enum SortType {
  Ascending = 'asc',
  Descending = 'desc',
}

interface SortingFieldProps {
  className?: string;
  fields: string[];
  value: { field: string; type: SortType };
  onChange?: (value: { field: string; type: SortType }) => void;
}

const SortingField: FC<SortingFieldProps> = ({
  className,
  fields,
  value,
  onChange,
}) => {
  const changeSort = (field: string) => {
    if (!onChange) return;
    onChange({
      field: field,
      type:
        value.field != field || value.type == SortType.Descending
          ? SortType.Ascending
          : SortType.Descending,
    });
  };

  return (
    <div className={`${className}`}>
      <ul className="flex flex-wrap">
        {fields.map((f) => (
          <li key={f} className="mr-1">
            <button
              className={`flex items-center rounded border border-brown px-1 py-0.5 ${
                value.field == f.split(' ').join('_').toLowerCase() &&
                'bg-brown text-white'
              }`}
              onClick={() => changeSort(f.split(' ').join('_').toLowerCase())}
              type="button"
            >
              {f
                .split(' ')
                .map((v) => v.at(0)?.toUpperCase() + v.slice(1).toLowerCase())
                .join(' ')}
              <span className="ml-1">
                {value.field == f.split(' ').join('_').toLowerCase() &&
                value.type == SortType.Ascending ? (
                  <GoSortAsc />
                ) : value.field == f.split(' ').join('_').toLowerCase() &&
                  value.type == SortType.Descending ? (
                  <GoSortDesc />
                ) : (
                  ''
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

{
  /* <div className="mb-3 flex border-b border-brown pb-1">
  <h2 className="mr-1 font-bold">Sorting:</h2>
  
</div>; */
}

export default SortingField;
