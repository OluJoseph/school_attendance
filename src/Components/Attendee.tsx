import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, IAttendanceRecord, IAttendee } from "../Util/constants";

import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext } from "../Util/context";
import { updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { get, update } from "../Util/api";
import SelectInput from "./input/SelectInput";

type AttendeeModalProps = {
  closeModal?: any;
  targetData: IAttendee;
};

const AttendeeValidationSchema = {
  role: {
    required: true,
  },
};

const Attendee = ({ closeModal, targetData }: AttendeeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const [formValues, setFormValues] = useState({
    role: targetData?.role,
  });

  const [records, setRecords] = useState<IAttendanceRecord[]>();

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  function displayRecords() {
    const recordNodes = records?.map((record: IAttendanceRecord) => {
      return (
        <li key={record.lectureId} className="py-4 px-2 w-full border-b">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700">
                {record.Lecture?.lectureName}
              </p>
              <div>
                <span className="text-slate-700 text-sm mr-4">
                  In:{" "}
                  {record.timeIn
                    ? new Date(record.timeIn).toLocaleTimeString()
                    : ""}
                </span>
                <span className="text-slate-700 text-sm">
                  Out:{" "}
                  {record.timeOut
                    ? new Date(record.timeOut).toLocaleTimeString()
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </li>
      );
    });
    return <ul className="w-full text-left px-4">{recordNodes}</ul>;
  }

  async function saveLecture() {
    if (
      validate(null, formValues, AttendeeValidationSchema, setErrors, errors)
    ) {
      try {
        let result = (
          await update(
            `/courseEvent/attendee/${targetData?.schoolId}/${targetData.courseEventId}/${targetData?.attendeeInstanceId}`,
            formValues
          )
        ).data;

        if (result) {
          setAlert({
            message: "Attendee updated",
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
        message: "Error updating attendee",
        severity: AlertSeverity.error,
      });
    }
  }

  async function fetchAttendeeRecords() {
    try {
      const records = (
        await get(
          `/attendanceRecords/scholar/${targetData.courseEventId}/${targetData.scholarId}`
        )
      ).data;

      records && setRecords(records);
      setIsFetchingData(false);
    } catch (error) {
      setIsFetchingData(false);
      setAlert({
        message: "Error fetching attendance records",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      saveLecture();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  useEffect(() => {
    setIsFetchingData(true);
    fetchAttendeeRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal closeModal={closeModal}>
      <div className="w-full h-[700px] max-h-[700px]">
        <h4 className="absolute top-[20px] left-[16px]">
          <p>
            <span className="font-semibold">{targetData.User?.fullname}, </span>
            {targetData.Scholar?.schoolNumber}
          </p>
        </h4>
        <hr className="mt-3 border-slate-100" />
        <div className="p-4 w-full">
          <form className="flex items-center gap-2 max-w-[300px] pt-2">
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
                  AttendeeValidationSchema,
                  setErrors,
                  errors
                )
              }
              options={["attendee", "supervisor"]}
              name={"role"}
              label={"Role"}
              value={formValues.role}
              errors={errors}
              specs={{ disabled: isSubmitting }}
            />
            <div className="">
              <button
                onClick={handleSubmit}
                type="submit"
                className="py-2 px-4 bg-teal-600 rounded text-white h-[38px] w-[70px] flex items-center justify-center"
                disabled={isSubmitting}
              >
                {!isSubmitting ? (
                  !targetData ? (
                    "Submit"
                  ) : (
                    "Save"
                  )
                ) : (
                  <SpinnerLoader />
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="p-4 border-t border-b w-full mb-2">
          <p className="font-semibold">Attendance Records</p>
        </div>
        <div className="text-center relative w-[540px]">
          {isFetchingData && (
            <div className="absolute left-[47%] top-32">
              <SpinnerLoader />
            </div>
          )}
          {displayRecords()}
        </div>
      </div>
    </Modal>
  );
};

export default Attendee;
