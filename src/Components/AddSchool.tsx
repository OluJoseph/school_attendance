import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity } from "../Util/constants";
import Input from "./input/Input";
import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext } from "../Util/context";
import { updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { post } from "../Util/api";

type AddSchoolModalProps = {
  closeModal?: any;
  callbackOnSave: () => {};
};

const addSchoolValidationSchema = {
  schoolName: {
    required: true,
  },
};

const AddSchool = ({ closeModal, callbackOnSave }: AddSchoolModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formValues, setFormValues] = useState(() => {
    return { schoolName: "" };
  });

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function saveSchool() {
    if (
      validate(null, formValues, addSchoolValidationSchema, setErrors, errors)
    ) {
      try {
        let result = (await post(`/school`, formValues)).data;
        if (result) {
          setAlert({
            message: "School saved",
            severity: AlertSeverity.success,
          });
          setIsSubmitting(false);
          closeModal();
          callbackOnSave();
        }
      } catch (err: any) {
        setIsSubmitting(false);
        if (err.message === "Network Error") {
          setNetworkError(true);
        } else if (err.code === "ECONNABORTED") {
          setAlert({
            message: "Request timeout",
            severity: AlertSeverity.warning,
          });
          return;
        }
        setAlert({
          message: "An error occured",
          severity: AlertSeverity.error,
        });
      }
    } else {
      setIsSubmitting(false);
      setAlert({
        message: "Error creating school",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      saveSchool();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Modal closeModal={closeModal}>
      <div>
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          Create School
        </h4>
        <hr className="mt-3 border-slate-100" />
        <form className="flex flex-col gap-4 p-4">
          <Input
            type={"text"}
            handleChange={(e: any) =>
              updateFormValues(
                e.target.name,
                e.target.value,
                formValues,
                setFormValues
              )
            }
            handleBlur={(e: any) =>
              validate(
                e,
                formValues,
                addSchoolValidationSchema,
                setErrors,
                errors
              )
            }
            name={"schoolName"}
            label={"School Name"}
            value={formValues.schoolName}
            errors={errors}
            specs={{ disabled: isSubmitting }}
          />
          <div className="w-full flex justify-end">
            <button
              onClick={handleSubmit}
              type="submit"
              className="py-2 px-4 bg-teal-600 rounded text-white h-[38px] w-[70px] flex items-center justify-center"
              disabled={isSubmitting}
            >
              {!isSubmitting ? "Submit" : <SpinnerLoader />}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSchool;
