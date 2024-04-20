import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputProps } from "./Input";

export default function ComboBox({
  handleChange,
  handleBlur,
  value,
  name,
  errors,
  specs,
  options,
  label,
}: InputProps) {
  const [isInputFocused, setInputFocus] = useState<boolean>(false);

  function handleInputBlur(event: any) {
    setInputFocus(false);
    handleBlur && handleBlur(event);
  }
  return (
    <div className="relative mb-4 ">
      <fieldset
        data-testid="inputWrapper"
        onBlur={handleInputBlur}
        onFocus={() => setInputFocus(true)}
        className={`${
          isInputFocused && "border-teal-500"
        } relative transition border w-full rounded-lg ${
          label ? "h-[60px]" : "h-[44px]"
        } flex items-center p-0`}
      >
        {label && (
          <legend className="ml-3 px-2 text-sm text-slate-500">{label}</legend>
        )}
        <Autocomplete
          {...specs}
          disablePortal
          id={name}
          options={options}
          onInputChange={handleChange}
          value={value}
          freeSolo={true}
          sx={{
            width: "100%",
            height: "100%",
            "& fieldset": {
              border: "none",
            },
            "& .MuiFormLabel-root": {
              display: "none",
            },
            "& .MuiInputBase-root": {
              height: "100%",
              padding: "0rem 0.9rem",
            },
          }}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      </fieldset>
      {Object.keys(errors).length > 0 && errors[name] && (
        <span className="absolute left-[10px] bottom-[-25px] text-red-400 text-sm">
          {errors[name]}
        </span>
      )}
    </div>
  );
}
