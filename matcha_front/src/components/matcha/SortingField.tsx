import { FC } from 'react';

import { GoSortAsc, GoSortDesc } from 'react-icons/go';
import { SortType, sortFields } from './Matcha';

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
        value.field != field
          ? sortFields[field as keyof typeof sortFields]
          : value.type == SortType.Descending
          ? SortType.Ascending
          : SortType.Descending,
    });
  };

  return (
    <div className={`${className}`}>
      <ul className="flex flex-wrap gap-y-1">
        {fields.map((f) => (
          <li key={f} className="mr-1">
            <button
              className={`flex items-center rounded border border-brown px-1 py-0.5 ${
                value.field == f && 'bg-brown text-white'
              }`}
              onClick={() => changeSort(f)}
              type="button"
            >
              {f
                .split('_')
                .map((v) => v.at(0)?.toUpperCase() + v.slice(1).toLowerCase())
                .join(' ')}
              <span className="ml-1">
                {value.field == f && value.type == SortType.Ascending ? (
                  <GoSortAsc />
                ) : value.field == f && value.type == SortType.Descending ? (
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

export default SortingField;
