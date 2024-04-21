import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, IAttendee, ICourseEvent, ModeOfAttendance } from "../Util/constants";
import Input from "./input/Input";
import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext, ScholarContext } from "../Util/context";
import { updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { post } from "../Util/api";
import SelectInput from "./input/SelectInput";

type AddEventModalProps = {
  closeModal?: any;
  targetData: ICourseEvent | IAttendee;
};

const addEventValidationSchema = {
  eventName: {
    required: true,
  },
  courseCode: {
    required: true,
  },
  startDate: {
    required: true,
  },
  endDate: {
    required: true,
  },
  ModeOfAttendance: {
    required: true,
  },
};

const AddEvent = ({ closeModal, targetData }: AddEventModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { scholar } = useContext(ScholarContext);

  const [formValues, setFormValues] = useState(() => {
    return {
      eventName: "",
      courseCode: "",
      startDate: "",
      endDate: "",
      modeOfAttendance: ModeOfAttendance.RFID,
    };
  });

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function saveEvent() {
    if (
      validate(null, formValues, addEventValidationSchema, setErrors, errors)
    ) {
      try {
        let result = (
          await post(`/courseEvent`, {
            ...formValues,
            schoolId: scholar.schoolId,
          })
        ).data;
        if (result) {
          setAlert({
            message: "Event saved",
            severity: AlertSeverity.success,
          });
          setIsSubmitting(false);
          closeModal();
          window.location.reload();
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
          message: err.response?.data || "An error occured",
          severity: AlertSeverity.error,
        });
      }
    } else {
      setIsSubmitting(false);
      setAlert({
        message: "Error creating event",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      saveEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Modal closeModal={closeModal}>
      <div>
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          Create Course Event
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
                addEventValidationSchema,
                setErrors,
                errors
              )
            }
            name={"eventName"}
            label={"Event Name"}
            value={formValues.eventName}
            errors={errors}
            specs={{ disabled: isSubmitting }}
          />
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
                addEventValidationSchema,
                setErrors,
                errors
              )
            }
            name={"courseCode"}
            label={"Course Code"}
            value={formValues.courseCode}
            errors={errors}
            specs={{ disabled: isSubmitting }}
          />
          <Input
            type={"date"}
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
                addEventValidationSchema,
                setErrors,
                errors
              )
            }
            name={"startDate"}
            label={"Start Date"}
            value={formValues.startDate}
            errors={errors}
            specs={{ disabled: isSubmitting }}
          />
          <Input
            type={"date"}
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
                addEventValidationSchema,
                setErrors,
                errors
              )
            }
            name={"endDate"}
            label={"End Date"}
            value={formValues.endDate}
            errors={errors}
            specs={{ disabled: isSubmitting }}
          />
          <SelectInput
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
                addEventValidationSchema,
                setErrors,
                errors
              )
            }
            options={["RFID", "bluetooth"]}
            name={"modeOfAttendance"}
            label={"Attendance Mode"}
            value={formValues.modeOfAttendance}
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

export default AddEvent;
