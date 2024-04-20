import React, { useContext, useEffect, useState } from "react";
import TopMenuBar from "../../Components/TopMenuBar";
import Page from "../../Components/Page";
import { Link, useNavigate } from "react-router-dom";
import { AlertSeverity, arrowIconYellow } from "../../Util/constants";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";
import { AlertContext, ApiErrorContext } from "../../Util/context";
import { post } from "../../Util/api";
import { validate } from "./util";
import Input from "../../Components/input/Input";

import { updateFormValues } from "../../Util/util";

const signupValidationSchema = {
  email: {
    required: true,
    email: true,
  },
  fullname: {
    required: true,
  },
  password: {
    required: true,
  },
  repeatPassword: {
    required: true,
  },
};

function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formValues, setFormValues] = useState({
    email: "",
    fullname: "",
    password: "",
    repeatPassword: "",
  });

  const navigate = useNavigate();

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function signup() {
    if (validate(null, formValues, signupValidationSchema, setErrors, errors)) {
      try {
        const response = await post("/user/signup", formValues);
        console.log(response);
        setAlert({
          message: `user created`,
          severity: AlertSeverity.success,
        });
        navigate("/");
      } catch (err: any) {
        setIsSubmitting(false);

        if (err.message === "Network Error") {
          setNetworkError(true);
        } else if (err.code === "ECONNABORTED") {
          setAlert({
            message: "Request Timeout",
            severity: AlertSeverity.warning,
          });
          return;
        }
		console.warn(err)
        setAlert({
          message: err.response?.data || "unable to create user",
          severity: AlertSeverity.error,
        });
      }
    } else {
      setIsSubmitting(false);
      setAlert({
        message: "An error occured",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      signup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Page>
      <div className="flex flex-col h-full items-center">
        <TopMenuBar/>

        <div className="flex-1 flex flex-col pt-14 sm:pt-32 overflow-y-auto pb-16 w-full sm:w-[380px]">
          <div className="relative flex flex-col gap-6 items-start px-4 w-full">
            <h3 className="relative text-teal-600 text-xl font-bold text-left">
              Signup
            </h3>
            <form className="w-full flex-1 flex flex-col gap-4 mb-20 text-left">
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
                    e.target.name,
                    formValues,
                    signupValidationSchema,
                    setErrors,
                    errors
                  )
                }
                name={"email"}
                label={"Email"}
                value={formValues.email}
                errors={errors}
                specs={{ readOnly: isSubmitting }}
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
                    e.target.name,
                    formValues,
                    signupValidationSchema,
                    setErrors,
                    errors
                  )
                }
                name={"fullname"}
                label={"Full Name"}
                value={formValues.fullname}
                errors={errors}
              />
              <Input
                type={"password"}
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
                    e.target.name,
                    formValues,
                    signupValidationSchema,
                    setErrors,
                    errors
                  )
                }
                name={"password"}
                label={"Password"}
                value={formValues.password}
                errors={errors}
              />
              <Input
                type={"password"}
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
                    e.target.name,
                    formValues,
                    signupValidationSchema,
                    setErrors,
                    errors
                  )
                }
                name={"repeatPassword"}
                label={"Re-type Password"}
                value={formValues.repeatPassword}
                errors={errors}
              />
              <div className="w-full flex justify-center mt-4">
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
          <div className="flex justify-center">
            <Link to={"/"} className="w-fit">
              <div
                className="w-fit px-3 py-2 border border-slate-400 rounded-lg
			   text-slate-600 active:bg-slate-0 trans10ition select-none"
              >
                Login
              </div>
            </Link>
          </div>
          <div className="absolute opacity-40 bottom-[150px] left-[10px]">
            {arrowIconYellow}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default Signup;
