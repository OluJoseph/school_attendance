import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, ILecture } from "../Util/constants";
import Input from "./input/Input";
import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext } from "../Util/context";
import { adjustTimezone, updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { post, update } from "../Util/api";
import { useParams } from "react-router-dom";

type AddLectureModalProps = {
  closeModal?: any;
  targetData?: ILecture;
};

const addLectureValidationSchema = {
  lectureName: {
    required: true,
  },
  start: {
    required: true,
  },
  end: {
    required: true,
  },
};

const AddLecture = ({ closeModal, targetData }: AddLectureModalProps) => {
  const { courseEventId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formValues, setFormValues] = useState(() => {
    return !targetData
      ? {
          start: "",
          end: "",
          courseEventId,
          lectureName: "",
        }
      : {
          lectureName: targetData.lectureName,
          start: targetData.start,
          end: targetData.end,
          courseEventId,
        };
  });

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function saveLecture() {
    if (
      validate(null, formValues, addLectureValidationSchema, setErrors, errors)
    ) {
      try {
        let result = !targetData
          ? (
              await post(`/lecture`, {
                ...formValues,
                start: adjustTimezone(formValues.start as string),
                end: adjustTimezone(formValues.end as string),
              })
            ).data
          : await update(
              `/lecture/${courseEventId}/${targetData.lectureId}`,
              formValues
            );

        if (result) {
          setAlert({
            message: "Lecture saved",
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
        message: "Error saving lecture",
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

  return (
    <Modal closeModal={closeModal}>
      <div>
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          {targetData === null ? "Create New Lecture" : "Lecture"}
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
                addLectureValidationSchema,
                setErrors,
                errors
              )
            }
            name={"lectureName"}
            label={"Lecture Name"}
            value={formValues.lectureName}
            errors={errors}
            specs={{ disabled: isSubmitting || targetData !== null }}
          />
          <Input
            type={"datetime-local"}
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
                addLectureValidationSchema,
                setErrors,
                errors
              )
            }
            name={"start"}
            label={"Start"}
            value={formValues.start}
            errors={errors}
            specs={{ disabled: isSubmitting }}
          />
          <Input
            type={"datetime-local"}
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
                addLectureValidationSchema,
                setErrors,
                errors
              )
            }
            name={"end"}
            label={"End"}
            value={formValues.end}
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
    </Modal>
  );
};

export default AddLecture;
