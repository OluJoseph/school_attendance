import React, { ReactNode } from "react";
import { DropdownOption } from "./User";

type DropdownProps = {
  header?: ReactNode;
  footer?: ReactNode;
  options: DropdownOption[];
};

const Dropdown = ({ header, footer, options }: DropdownProps) => {
  return (
    <div className="w-full bg-white py-2 rounded-lg pb-3 select-none">
      {header && header}
      {options &&
        options.map((option, key) => {
          return (
            <div
              //  passing a clickEvent through options for flexibility
              {...(option.clickEvent && { onClick: option.clickEvent })}
              key={key}
              className="py-3 w-full flex items-center gap-3 justify-start px-4 cursor-pointer lg:text-[15px]"
            >
              {option.icon && <>{option.icon}</>}
              {option.name}
            </div>
          );
        })}
      {footer && <div className="lg:text-[15px]">{footer}</div>}
    </div>
  );
};

export default Dropdown;
