import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, ICourseEvent, IDevice } from "../Util/constants";
import Input from "./input/Input";
import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext, ScholarContext } from "../Util/context";
import { updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { post, update } from "../Util/api";
import SelectInput from "./input/SelectInput";

type AddDeviceModalProps = {
  closeModal?: any;
  targetData: IDevice;
  allEvents?: ICourseEvent[];
  callbackOnSave: () => {};
};

const addDeviceValidationSchema = {
  deviceName: {
    required: true,
  },
};

const AddDevice = ({
  closeModal,
  targetData,
  allEvents,
  callbackOnSave,
}: AddDeviceModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  let eventNameAndIdMap: any = {};
  let targetDeviceEventName = "";

  targetData &&
    allEvents?.forEach((event: any) => {
      event = (event.CourseEvent as ICourseEvent) || (event as ICourseEvent);
      eventNameAndIdMap[event.eventName] = event.courseEventId;
      if (event.courseEventId === targetData.courseEventId) {
        targetDeviceEventName = event.eventName;
      }
    });

  const [formValues, setFormValues] = useState<any>(() => {
    return !targetData
      ? { deviceName: "" }
      : {
          deviceName: targetData.deviceName,
          deviceId: targetData.deviceId,
          mode: targetData.mode,
          courseEvent: targetDeviceEventName,
          use: targetData.use,
        };
  });

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  const { scholar } = useContext(ScholarContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function saveDevice() {
    if (
      validate(null, formValues, addDeviceValidationSchema, setErrors, errors)
    ) {
      try {
        let result = !targetData
          ? (
              await post(`/device`, {
                ...formValues,
                schoolId: scholar.schoolId,
              })
            ).data
          : (
              await update(
                `device/${scholar.schoolId}/${targetData.deviceId}`,
                {
                  mode: formValues.mode,
                  use: formValues.use,
                  courseEventId:
                    eventNameAndIdMap[formValues.courseEvent] || null,
                }
              )
            ).data;
        if (result) {
          setAlert({
            message: "Device saved",
            severity: AlertSeverity.success,
          });
          setIsSubmitting(false);
          closeModal();
          callbackOnSave();
        }
      } catch (err: any) {
        console.log(err);
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
        message: "Error saving device",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      saveDevice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Modal closeModal={closeModal}>
      <div>
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          {!targetData ? "Create New Device" : "Device"}
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
                addDeviceValidationSchema,
                setErrors,
                errors
              )
            }
            name={"deviceName"}
            label={"Device Name"}
            value={formValues.deviceName}
            errors={errors}
            specs={{ disabled: isSubmitting || targetData !== null }}
          />
          {targetData !== null && (
            <>
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
                    addDeviceValidationSchema,
                    setErrors,
                    errors
                  )
                }
                name={"deviceId"}
                label={"Device ID"}
                value={formValues.deviceId}
                errors={errors}
                specs={{ disabled: isSubmitting || targetData !== null }}
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
                    addDeviceValidationSchema,
                    setErrors,
                    errors
                  )
                }
                options={["enrollment", "attendance"]}
                name={"mode"}
                label={"Device Mode"}
                value={formValues.mode}
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
                    addDeviceValidationSchema,
                    setErrors,
                    errors
                  )
                }
                options={["RFID", "Bluetooth"]}
                name={"use"}
                label={"Use"}
                value={formValues.use}
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
                    addDeviceValidationSchema,
                    setErrors,
                    errors
                  )
                }
                options={["", ...Object.keys(eventNameAndIdMap)]}
                name={"courseEvent"}
                label={"Course Event"}
                value={formValues.courseEvent}
                errors={errors}
                specs={{ disabled: isSubmitting }}
              />
            </>
          )}
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

export default AddDevice;
