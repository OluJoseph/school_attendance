import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../Util/context";
import Dropdown from "./Dropdown";
import { logout } from "../Util/util";

export type DropdownOption = {
  name: string;
  clickEvent?: any;
  linkTo?: string;
  icon?: any;
};

/**Gives an icon which has a dropdown containing
 * User email and a list of menu options
 * including a logout functionality
 */

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const userDropdownOptions: DropdownOption[] = [
    // {
    //   name: "Add School",
    //   clickEvent: () => handleNavigation("/attendance"),
    //   icon: <i className="fa fa-plus text-lg text-slate-500"></i>,
    // },
  ];

  function handleNavigation(path: string) {
    toggleShowDropdown();
    path !== location.pathname && navigate(path);
  }

  function toggleShowDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (
    <div className="select-none">
      <div
        onClick={toggleShowDropdown}
        className=" flex items-center gap-2 cursor-pointer"
      >
        <div className="bg-slate-200 w-[25px] h-[25px] flex items-center justify-center rounded-full">
          <i className="fa fa-user text-slate-400 text-sm"></i>
        </div>
        <div>
          <i
            className={`p-0 fa fa-caret-down text-sm ${
              showDropdown ? "rotate-180" : ""
            } text-slate-400 transition duration-500`}
          ></i>
        </div>
      </div>

      {showDropdown && (
        <div
          onClick={toggleShowDropdown}
          className="fixed z-20 top-0 left-0 h-screen w-screen"
        ></div>
      )}

      <div
        className={`${
          showDropdown
            ? "animate-slideDown dropdown-open visible"
            : "dropdown-close hidden"
        } absolute z-30 min-w-[180px] w-fit max-w-[270px] right-[10px] top-[32px] shadow-2xl shadow-slate-300 rounded-lg overflow-clip `}
      >
        <Dropdown
          options={userDropdownOptions}
          header={
            <div className="text-start px-4 py-2 text-slate-500 border-b truncate">
              {user?.email}
            </div>
          }
          footer={
            <div className="text-start px-4 pt-4 text-teal-600">
              <span
                onClick={() => logout(setUser, navigate)}
                className="active:font-semibold cursor-pointer"
              >
                Logout
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default User;
