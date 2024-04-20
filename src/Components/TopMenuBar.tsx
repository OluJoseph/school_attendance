import React from "react";

const TopMenuBar = () => {
  return (
    <div className="relative w-full py-3 px-4 flex justify-start items-center bg-teal-700 rounded-b-lg">
      <h2 className="text-white text-lg flex items-center gap-2 cursor-pointer select-none font-extrabold">
        {/* <i className="fa fa-home text-slate-200"></i> */}
        <span className="text-slate-200">Attendance</span>
      </h2>
    </div>
  );
};

export default TopMenuBar;
