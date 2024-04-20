import React from "react";

/**
 * This Modal component always renders a centered div that contains the child component
 * it also has a non-visible fixed div such that when clicked outside the main component the modal closes
 */

const Modal = ({ children, closeModal }: any) => {
  function handleCloseModal(e: any) {
    closeModal && closeModal();
  }
  return (
    <div className="fixed sm:px-4 top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div
        onClick={handleCloseModal}
        className="h-full w-full absolute"
      ></div>
      <div className="relative sm:w-fit sm:min-w-[400px] w-full sm:shadow-slate-200 sm:shadow-xl sm:rounded-lg bg-white h-full sm:h-fit pt-10 z-20">
        {closeModal && (
          <div
            className="absolute top-[20px] right-[16px] cursor-pointer"
            onClick={closeModal}
          >
            <i className="fa fa-close text-slate-400 text-[20px]"></i>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
