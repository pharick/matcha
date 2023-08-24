import { findTags } from '@/api/tags';
import {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useEffect,
  useState,
} from 'react';
import { BiX } from 'react-icons/bi';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<number | null>(
    null
  );

  const handleAdd = () => {
    const trimmed = fieldVal.trim().toLowerCase();
    if (trimmed.length <= 0 || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setFieldVal('');
    setSuggestions([]);
    setCurrentSuggestion(null);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key == ' ') e.preventDefault();
    else if (e.key == 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key == 'ArrowUp') {
      e.preventDefault();
      setCurrentSuggestion((i) => {
        if (i == 0) return suggestions.length - 1;
        return (i ?? suggestions.length) - 1;
      });
    } else if (e.key == 'ArrowDown') {
      e.preventDefault();
      setCurrentSuggestion((i) => {
        return ((i ?? -1) + 1) % suggestions.length;
      });
    }
  };

  const updateSuggest = async (v: string) => {
    const suggest = await findTags(v);
    setSuggestions(suggest.filter((tag) => !value.includes(tag)));
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentSuggestion(null);
    setFieldVal(e.target.value);
    void updateSuggest(e.target.value);
  };

  useEffect(() => {
    if (
      currentSuggestion !== null &&
      currentSuggestion >= 0 &&
      currentSuggestion < suggestions.length
    ) {
      setFieldVal(suggestions[currentSuggestion]);
    }
  }, [currentSuggestion, suggestions]);

  const handleRemove = (i: number) => {
    const newVal = [...value];
    newVal.splice(i, 1);
    onChange(newVal);
  };

  return (
    <div
      className={`${
        className ?? ''
      } items-center rounded-[20px] bg-transparent bg-gradient-radial from-green-1/70 to-neutral/30`}
    >
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap">
          {value.map((val, i) => (
            <li
              key={i}
              className="ml-2 mt-2 flex items-center rounded bg-brown px-1 py-0.5 text-white"
            >
              {val}
              <button
                type="button"
                className="hover:text-gray-400"
                onClick={() => handleRemove(i)}
              >
                <BiX />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        name={name}
        type="text"
        placeholder="Enter new interest and press enter"
        className="block h-[50px] w-full rounded-[20px] bg-transparent text-center"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={fieldVal}
        autoComplete="off"
      />

      <ul>
        {suggestions.map((value, i) => (
          <li
            className={`border-t border-brown/10 py-1 last:rounded-b-[20px] ${
              currentSuggestion == i ? 'bg-brown/10' : ''
            }`}
            key={i}
          >
            <button
              type="button"
              className="w-full"
              onMouseOver={() => setCurrentSuggestion(i)}
              onClick={() => handleAdd()}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsField;
