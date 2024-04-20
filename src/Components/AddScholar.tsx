import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, IScholar, SchoolRoles } from "../Util/constants";
import Input from "./input/Input";
import { validate } from "../Features/Auth/util";
import { AlertContext, ApiErrorContext, ScholarContext } from "../Util/context";
import { updateFormValues } from "../Util/util";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { post, update } from "../Util/api";
import SelectInput from "./input/SelectInput";

type AddScholarModalProps = {
  closeModal?: any;
  targetData: IScholar;
};

const addScholarValidationSchema = {
  fullname: {
    required: true,
  },
  email: {
    required: true,
    type: "email",
  },
  role: {
    required: true,
  },
};

const AddScholar = ({ closeModal, targetData }: AddScholarModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formValues, setFormValues] = useState(() => {
    return !targetData
      ? {
          schoolNumber: "",
          fullname: "",
          email: "",
          role: SchoolRoles.student,
        }
      : {
          schoolNumber: targetData.schoolNumber || "",
          fullname: targetData.User?.fullname || "",
          email: targetData.User?.email || "",
          role: targetData.role,
        };
  });

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);
  const { scholar } = useContext(ScholarContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function saveScholar() {
    if (
      validate(null, formValues, addScholarValidationSchema, setErrors, errors)
    ) {
      try {
        let result = !targetData
          ? (
              await post(`/scholar`, {
                ...formValues,
                schoolId: scholar.schoolId,
              })
            ).data
          : await update(
              `scholar/${scholar.schoolId}/${targetData.scholarId}`,
              { schoolNumber: formValues.schoolNumber }
            );
        if (result) {
          setAlert({
            message: "Scholar saved",
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
        message: "Error saving scholar",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      saveScholar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Modal closeModal={closeModal}>
      <div>
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          {targetData === null ? "Create New Scholar" : "Scholar"}
        </h4>
        <hr className="mt-3 border-slate-100" />
        {targetData.role === SchoolRoles.student && (
          <div className="p-4 w-full border-b flex justify-between items-center">
            <p className="text-slate-600">
              Status: {targetData.enrolled ? "Enrolled" : "Not yet enrolled"}
            </p>
            {!targetData.enrolled ? (
              <span className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700">
                Begin enrollment
              </span>
            ) : (
              <span className="text-slate-700 text-sm">ID: {targetData.tagId}</span>
            )}
          </div>
        )}
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
                addScholarValidationSchema,
                setErrors,
                errors
              )
            }
            name={"schoolNumber"}
            label={"School Number/Matric"}
            value={formValues.schoolNumber}
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
                addScholarValidationSchema,
                setErrors,
                errors
              )
            }
            name={"fullname"}
            label={"Full Name"}
            value={formValues.fullname}
            errors={errors}
            specs={{ disabled: isSubmitting || targetData !== null }}
          />
          <Input
            type={"email"}
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
                addScholarValidationSchema,
                setErrors,
                errors
              )
            }
            name={"email"}
            label={"Email"}
            value={formValues.email}
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
                addScholarValidationSchema,
                setErrors,
                errors
              )
            }
            options={["lecturer", "student"]}
            name={"role"}
            label={"Role"}
            value={formValues.role}
            errors={errors}
            specs={{ disabled: isSubmitting || targetData !== null }}
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

export default AddScholar;
