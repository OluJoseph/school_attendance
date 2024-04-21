import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, ICourseEvent, IScholar } from "../Util/constants";
import Input from "./input/Input";
import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext } from "../Util/context";
import { updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { post } from "../Util/api";
import SelectInput from "./input/SelectInput";

type AddAttendeeModalProps = {
  closeModal?: any;
  allEvents: ICourseEvent[];
  targetScholar: IScholar;
};

const addAttendeeValidationSchema = {
  eventName: {
    required: true,
  },
};

const AddAttendee = ({
  closeModal,
  allEvents,
  targetScholar,
}: AddAttendeeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formValues, setFormValues] = useState(() => {
    return { eventName: "" };
  });

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  let eventNameAndIdMap: any = {};

  allEvents?.forEach((event: any) => {
    event = (event.CourseEvent as ICourseEvent) || (event as ICourseEvent);
    eventNameAndIdMap[event.eventName] = event.courseEventId;
  });

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function saveAttendee() {
    if (
      validate(null, formValues, addAttendeeValidationSchema, setErrors, errors)
    ) {
      try {
        let result = (
          await post(`/courseEvent/attendee`, {
            scholarId: targetScholar.scholarId,
            courseEventId: eventNameAndIdMap[formValues.eventName],
            schoolId: targetScholar.schoolId,
          })
        ).data;

        if (result) {
          setAlert({
            message: `scholar registered for ${formValues.eventName}`,
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
          message: "An error occured",
          severity: AlertSeverity.error,
        });
      }
    } else {
      setIsSubmitting(false);
      setAlert({
        message: "Error registering scholar",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      saveAttendee();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Modal closeModal={closeModal}>
      <div>
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          Register Scholar for Event
        </h4>
        <hr className="mt-3 border-slate-100" />
        <div className="px-4 pt-4">
          <p>
            {targetScholar.User?.fullname}, {targetScholar.schoolNumber}
          </p>
        </div>
        <form className="flex flex-col gap-4 p-4">
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
                addAttendeeValidationSchema,
                setErrors,
                errors
              )
            }
            options={["", ...Object.keys(eventNameAndIdMap)]}
            name={"eventName"}
            label={"Event Name"}
            value={formValues.eventName}
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

export default AddAttendee;
