import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }
  return (
    <section className="fixed top-0 left-0 z-10 w-screen h-screen flex items-start pt-56 justify-center bg-white">
      <div className="px-4 py-4 h-[200px] flex flex-col items-center justify-center">
        <i className="fa fa-exclamation-triangle text-slate-300 text-[40px] mb-2"></i>
        <h2
          style={{ fontFamily: "nunito-sans-extrabold" }}
          className="mb-2 text-[50px] text-slate-500"
        >
          404 Error!
        </h2>
        <p className="text-slate-500 text-center mb-10">
          Page is either inaccessible or not found
        </p>
        <div className="text-left w-full text-slate-500 mb-16 pl-4">
          <h5 className="mb-2">Possible reasons</h5>
          <ul className="flex flex-col gap-2 list-disc ml-5">
            <li>You are unauthorized to view this page</li>
            <li>The page does not exist</li>
          </ul>
        </div>

        <span className="text-blue-600 cursor-pointer" onClick={goBack}>
          <i className="fa fa-long-arrow-left mr-2 clickable "></i>Go Back
        </span>
      </div>
    </section>
  );
};

export default NotFound;
