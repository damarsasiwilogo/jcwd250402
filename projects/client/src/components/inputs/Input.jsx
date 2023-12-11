import { useState } from "react";
import { BiDollar } from "react-icons/bi";
import { useFormik, Field } from "formik";
import classNames from "classnames";

const Input = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  onChange,
  className,
  placeholder,
  onKeyDown,
  propValue,
}) => {
  const [value, setValue] = useState(""); // State to manage the input value

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const styleClass = classNames("tailwindcss", className);
  return (
    <div className="relative w-full">
      <Field
        id={id}
        name={id}
        disabled={disabled}
        register={useFormik}
        placeholder=" "
        type={type}
        value={value}
        onChange={handleChange}
        className={`w-full p-4 pt-6 pl-4 font-light transition bg-white border-2 rounded-md outline-none peer disabled:opacity-70 disabled:cursor-not-allowed ${styleClass}`}
        required={required}
        onKeyDown={onKeyDown}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
