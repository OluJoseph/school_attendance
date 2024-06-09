import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, IScholar } from "../Util/constants";
import { AlertContext, ApiErrorContext } from "../Util/context";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { get, post, remove } from "../Util/api";
import CountDown from "./CountDown";

type EnrollmentModalProps = {
  closeModal?: any;
  scholar: IScholar;
};

const Enrollment = ({ closeModal, scholar }: EnrollmentModalProps) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [session, setSession] = useState<string>();

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  async function initiateEnrollment() {
    try {
      const { enrollmentSession, message } = (
        await post("scholar/enroll", {
          schoolId: scholar.schoolId,
          scholarId: scholar.scholarId,
        })
      ).data;

      if (enrollmentSession) {
        setIsEnrolling(true);
        setSession(enrollmentSession);
        setAlert({
          message: `Enrollment started, ${message}`,
          severity: AlertSeverity.success,
        });

        const interval = setInterval(async () => {
          try {
            const timeout = setTimeout(() => {
              clearInterval(interval);
            }, 30000);

            const result: IScholar = (
              await get(`/scholar/${scholar.schoolId}/${scholar.scholarId}`)
            ).data;

            // check if there were any changes in tagId or bluetoothId
            if (
              (!scholar.tagId && result.tagId) ||
              (!scholar.bluetoothId && result.bluetoothId)
            ) {
              // scholar was updated
              setAlert({
                message: "scholar enrolled with selected tag/bluetooth",
                severity: AlertSeverity.success,
              });
              clearTimeout(timeout);
              handleEnrollmentEnd(interval);
            } else if (result.tagId && result.bluetoothId) {
              setAlert({
                message: "scholar already enrolled",
                severity: AlertSeverity.warning,
              });
              clearTimeout(timeout);
              handleEnrollmentEnd(interval);
            }
          } catch (error) {
            clearInterval(interval);
          }
        }, 5000);
      }
    } catch (err: any) {
      setIsEnrolling(false);
      closeModal();
      if (err.message === "Network Error") {
        setNetworkError(true);
      } else if (err.code === "ECONNABORTED") {
        setAlert({
          message: "Request timeout",
          severity: AlertSeverity.warning,
        });
        return;
      } else if (err.response?.data === "ongoing enrollment") {
        setAlert({
          message: "ongoing enrollment",
          severity: AlertSeverity.error,
        });
        return;
      }
      setAlert({
        message: "An error occured",
        severity: AlertSeverity.error,
      });
    }
  }

  async function handleEnrollmentEnd(interval: any = null, e: any = null) {
    e?.preventDefault();
    try {
      interval && clearInterval(interval);
      await remove(`/scholar/enroll/${scholar.schoolId}/${scholar.scholarId}`);

      closeModal();
    } catch (error) {
      closeModal();
      //
    }
  }

  useEffect(() => {
    !isEnrolling && initiateEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal>
      <div className="min-h-[300px] pb-32 sm:pb-0 h-full flex flex-col justify-between">
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          Enrollment
        </h4>
        <hr className="mt-3 border-slate-100" />
        <div className="w-full flex-1  flex items-center justify-center">
          {!isEnrolling ? (
            !session ? (
              <div className="text-center">
                <SpinnerLoader />
                <p className="mt-2">Starting enrollment</p>
              </div>
            ) : (
              "Session Expired"
            )
          ) : (
            <div className="text-center">
              <SpinnerLoader />
              <p className="my-2">Waiting for scan</p>
              <CountDown
                seconds={30}
                onCountEnd={() => {
                  setIsEnrolling(false);
                }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-between border-t items-center px-4 sm:py-2 py-4">
          <button
            onClick={handleEnrollmentEnd}
            type="submit"
            className="py-2 px-4 border border-red-500 rounded text-red-500 h-[38px] w-[70px] flex items-center justify-center"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Enrollment;
