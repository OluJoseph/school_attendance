import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AlertContext, ScholarContext } from "../../Util/context";

import { get } from "../../Util/api";
import { AlertSeverity } from "../../Util/constants";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";

import { UUID } from "crypto";

const SchoolLayout = () => {
  const navigate = useNavigate();
  const savedScholar = sessionStorage.getItem("scholar");
  const { schoolId } = JSON.parse(savedScholar || "");

  const [scholar, setScholar] = useState<any>();

  const { setAlert } = useContext(AlertContext);

  async function fetchScholar(schoolId: UUID) {
    try {
      const scholar = (await get(`/scholar/${schoolId}`)).data;

      scholar && setScholar(scholar);
    } catch (error) {
      setAlert({
        message: "could not get scholar data",
        severity: AlertSeverity.error,
      });
      navigate("/home");
    }
  }

  useEffect(() => {
    if (schoolId) {
      fetchScholar(schoolId);
    } else {
      navigate("/home");
      setAlert({
        message: "could not get scholar data",
        severity: AlertSeverity.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // making sure user data is set before rendering the outlet components
  return (
    <ScholarContext.Provider value={{ scholar, setScholar }}>
      <div className="h-full">
        {scholar ? (
          <>
            <Outlet />
          </>
        ) : (
          <div className="h-screen w-screen flex items-center justify-center">
            <SpinnerLoader />
          </div>
        )}
      </div>
    </ScholarContext.Provider>
  );
};

export default SchoolLayout;
