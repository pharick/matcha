interface RadioInputProps {
  onChange: string;
  onBlur: string;
  name: string;
  value: string;
}

const RadioInput: FC<RadioInputProps> = ({onChange}) => {
  return <input type="radio" onChange={onChange}></input>;
};
