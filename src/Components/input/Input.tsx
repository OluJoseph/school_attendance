import React, { useState } from "react";

export type InputProps = {
  handleChange: any;
  handleBlur?: any;
  value?: string | number | undefined | Date;
  type?: string;
  placeholder?: string;
  name: string;
  specs?: any;
  errors: any;
  options?: any;
  label?: string;
};

const Input = ({
  handleChange,
  handleBlur,
  value,
  type,
  placeholder,
  name,
  errors,
  specs,
  label,
}: InputProps) => {
  const [isInputFocused, setInputFocus] = useState<boolean>(false);

  function handleInputBlur(event: any) {
    setInputFocus(false);
    handleBlur && handleBlur(event);
  }

  return (
    <div className="relative mb-4">
      <fieldset
        data-testid="inputWrapper"
        onBlur={handleInputBlur}
        onFocus={() => setInputFocus(true)}
        className={`${
          isInputFocused && "border-teal-500"
        } relative transition border overflow-clip w-full rounded-lg ${
          label ? "h-[60px]" : "h-[44px]"
        } flex items-center p-0`}
      >
        {label && (
          <legend className="ml-3 px-2 text-sm text-slate-500">{label}</legend>
        )}
        <input
          name={name}
          className="w-full h-full px-5"
          placeholder={placeholder}
          type={type}
          onChange={(e) => handleChange(e)}
          value={value}
          {...specs}
        />
      </fieldset>
      {Object.keys(errors).length > 0 && errors[name] && (
        <span className="absolute left-[10px] bottom-[-25px] text-red-400 text-sm">
          {errors[name]}
        </span>
      )}
    </div>
  );
};

export default Input;
