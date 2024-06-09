import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../Util/api";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";
import Input from "../../Components/input/Input";
import Page from "../../Components/Page";
import TopMenuBar from "../../Components/TopMenuBar";
import { AlertSeverity, arrowIconYellow } from "../../Util/constants";
import { AlertContext, ApiErrorContext } from "../../Util/context";
import { validate } from "./util";
import { updateFormValues } from "../../Util/util";

/** renders a login form that takes in only the user's email for now
 * and then gets a session token which is stored in session storage
 * if the token expires, the user is redirected to this page
 *
 * calls the attendance-api to authenticate and authorize user and then navigates
 * to the attendance page
 */

const loginValidationSchema = {
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
  },
};

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
  }

  async function login() {
    if (validate(null, formValues, loginValidationSchema, setErrors, errors)) {
      try {
        const response = await post("/user/login", formValues);
        const { token } = response.data;
        sessionStorage.setItem("amsUser", token);

        navigate("/home");
      } catch (err: any) {
        setIsSubmitting(false);
        if (err.response?.status === 404) {
          setAlert({
            message: "User does not exist",
            severity: AlertSeverity.error,
          });
          return;
        } else if (err.response?.status === 403) {
          setAlert({
            message: "User not verified. Check email for activation",
            severity: AlertSeverity.error,
          });
          return;
        } else if (err.message === "Network Error") {
          setNetworkError(true);
        } else if (err.code === "ECONNABORTED") {
          setAlert({
            message: "Request timeout",
            severity: AlertSeverity.warning,
          });
          return;
        }

        setAlert({
          message: "Error Logging In",
          severity: AlertSeverity.error,
        });
      }
    } else {
      setIsSubmitting(false);
      setAlert({
        message: "Error logging in",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Page>
      <div className="flex flex-col h-full">
        <TopMenuBar />

        <div className="flex-1 flex flex-col pt-14 pb-16 sm:pt-32 items-center">
          <div className="relative flex flex-col gap-6 items-start px-4 w-full sm:w-[380px]">
            <h3 className="relative text-teal-600 text-xl font-bold">Login</h3>
            <form className="relative w-full flex flex-col gap-4 mb-20 text-left">
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
                    loginValidationSchema,
                    setErrors,
                    errors
                  )
                }
                name={"email"}
                label={"Email"}
                value={formValues.email}
                errors={errors}
                specs={{ disabled: isSubmitting }}
              />
              <div className="relative">
                <Input
                  type="password"
                  handleChange={(e: any, value: any) =>
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
                      loginValidationSchema,
                      setErrors,
                      errors
                    )
                  }
                  name={"password"}
                  label={"Password"}
                  value={formValues.password}
                  errors={errors}
                  specs={{ disabled: isSubmitting }}
                />
              </div>
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="py-2 px-4 bg-teal-600 rounded text-white h-[38px] w-[70px] flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {!isSubmitting ? "Login" : <SpinnerLoader />}
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center select-none">
            <Link to={"/signup"} className="w-fit">
              <div
                className="w-fit px-3 py-2 border border-slate-400 rounded-lg
			   text-slate-600 active:bg-slate-0 trans10ition select-none"
              >
                Signup
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
};

export default Login;
