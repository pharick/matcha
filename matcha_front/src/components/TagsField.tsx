import { ChangeEventHandler, FC, KeyboardEventHandler, useState } from 'react';

interface TagsFieldProps {
  className?: string;
  name: string;
  value: string[];
  onChange: (value: string[]) => void;
}

const TagsField: FC<TagsFieldProps> = ({
  className,
  name,
  onChange,
  value,
}) => {
  const [fieldVal, setFieldVal] = useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.endsWith(' ')) {
      const trimmed = e.target.value.trim();
      if (trimmed) onChange([...value, trimmed]);
      setFieldVal('');
    } else {
      setFieldVal(e.target.value);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key != 'Backspace' || fieldVal) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div
      className={`${
        className ?? ''
      } items-center rounded-[20px] bg-transparent bg-gradient-radial from-green-1/70 to-neutral/30`}
    >
      <ul className="flex flex-wrap">
        {value.map((val, i) => (
          <li
            key={i}
            className="ml-2 mt-2 rounded bg-brown px-1 py-0.5 text-white"
          >
            {val}
          </li>
        ))}
      </ul>
      <input
        name={name}
        type="text"
        className="mt-2 block h-[50px] w-full rounded-b-[20px] bg-transparent text-center"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={fieldVal}
      />
    </div>
  );
};

export default TagsField;
