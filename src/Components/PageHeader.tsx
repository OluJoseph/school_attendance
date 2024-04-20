import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../Util/context";

import User from "./User";

type PageHeaderProps = {
  description?: string;
  showReturnButton?: boolean;
};

const PageHeader = ({
  description,
  showReturnButton = true,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  return (
    <div
      className={`py-4 px-4 h-[56px] min-h-[56px] flex justify-between lg:justify-center items-center ${
        showReturnButton && "pl-14 lg:pl-4"
      }`}
    >
      {showReturnButton && (
        <div className="absolute left-[16px] cursor-pointer">
          <svg
            width="25px"
            height="25px"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            stroke="#000000"
            strokeWidth="0.01"
            transform="matrix(1, 0, 0, 1, 0, 0)"
            onClick={goBack}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#CCCCCC"
              strokeWidth="0.1"
            />

            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z"
                fill="#33363F"
              />{" "}
            </g>
          </svg>
        </div>
      )}
      <p className="lg:inline-block font-bold">{description}</p>
      <div className="lg:absolute right-[16px]">
        <ul className="flex gap-1 text-[16px] select-none items-center">
          <li className="flex items-center ml-4">
            <User />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PageHeader;
