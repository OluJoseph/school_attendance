// react
import React, { useState } from "react";
import { InputProps } from "./Input";

const SelectInput = ({
  handleChange,
  handleBlur,
  value,
  placeholder,
  name,
  errors,
  specs,
  options,
  label,
}: InputProps) => {
  let [isFocused, setIsFocused] = useState<boolean>(false);

  function handleInputBlur(event: any) {
    setIsFocused(false);
    handleBlur && handleBlur(event);
  }

  return (
    <div className="relative mb-4 w-full">
      <fieldset
        data-testid="selectInputWrapper"
        onFocus={() => setIsFocused(true)}
        onBlur={handleInputBlur}
        className={`${
          isFocused && "border-teal-500"
        } relative transition border overflow-clip w-full rounded-lg h-[60px] flex items-center p-0 pr-4`}
      >
        <legend className="ml-3 px-2 text-sm text-slate-500">{label}</legend>
        <select
          {...specs}
          name={name}
          className="w-full h-full px-4"
          placeholder={placeholder}
          value={value}
          onChange={(e: any) => handleChange(e)}
        >
          {options &&
            options.map((option: any, index: number) => {
              return (
                <option value={option} key={index}>
                  {option}
                </option>
              );
            })}
        </select>
      </fieldset>
      {Object.keys(errors).length > 0 && errors[name] && (
        <span className="absolute left-[10px] bottom-[-25px] text-red-400 text-sm">
          {errors[name]}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
