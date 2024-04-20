import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Page from "../../Components/Page";

import { AlertContext, ApiErrorContext, UserContext } from "../../Util/context";
import { AlertSeverity, IScholar } from "../../Util/constants";
import { get } from "../../Util/api";
import { logout } from "../../Util/util";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";
import PageHeader from "../../Components/PageHeader";
import { useModal } from "../../Util/hooks";
import { createPortal } from "react-dom";
import AddSchool from "../../Components/AddSchool";

/**renders a page that shows today's attendance summary of the user
 * and prompts the user to scan the attendance qr if no attendance is found
 * it gets the user's attendance details on initial render
 *
 * has a link to scan the attendance qr
 */

const Home = () => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("amsUser");

  const addSchoolModal = useModal();

  const { user, setUser } = useContext(UserContext);

  const { setNetworkError } = useContext(ApiErrorContext);
  const { setAlert } = useContext(AlertContext);

  const [userSchools, setSchools] = useState<IScholar[]>();
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  async function fetchData() {
    try {
      if (!user) {
        let thisUser = (await get("user")).data;
        thisUser && setUser(thisUser);
      }

      const userSchools: IScholar[] = (await get("school/allSchools")).data;
      userSchools && setSchools(userSchools);
      setIsFetchingData(false);
    } catch (err: any) {
      setIsFetchingData(false);
      if (err.response?.status === 401) {
        logout(setUser, navigate);
      } else if (err.message === "Network Error") {
        setNetworkError(true);
      } else if (err.code === "ECONNABORTED") {
        setAlert({
          message: "Request timeout",
          severity: AlertSeverity.warning,
        });
      } else if (err.response?.status === 404) {
        setAlert({ message: "User Not Found", severity: AlertSeverity.error });
        logout(setUser, navigate);
      }
    }
  }

  function goToSchool(scholar: IScholar) {
    sessionStorage.setItem(
      "scholar",
      JSON.stringify({
        schoolId: scholar.School?.schoolId,
        role: scholar.role,
      })
    );
    navigate(`/${scholar.School?.schoolName}`);
  }

  function displaySchools() {
    let schoolNodes = userSchools?.map((scholar: IScholar) => {
      return (
        <li key={scholar.scholarId} className="py-4 px-2 w-full border-b">
          <div className="flex justify-between">
            <h4
              onClick={() => goToSchool(scholar)}
              className="cursor-pointer text-blue-500 hover:text-blue-400 active:text-blue-700"
            >
              {scholar?.School?.schoolName}
            </h4>

            <span className="text-slate-400 italic">{scholar.role}</span>
          </div>
        </li>
      );
    });

    return <ul className="w-full text-left">{schoolNodes}</ul>;
  }

  function openSchoolModal() {
    addSchoolModal.setIsModalOpen(true);
  }

  useEffect(() => {
    if (userToken) {
      setIsFetchingData(true);
      fetchData();
    } else {
      logout(setUser, navigate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full">
      {user ? (
        <Page>
          {<PageHeader showReturnButton={false} description={user.fullname} />}

          <hr />
          <section className="h-full pb-36 sm:px-[10%] lg:px-[20%] overflow-y-auto">
            <div className="text-left px-4">
              <div className="flex justify-between items-center py-4">
                <h3 className="font-semibold">Your Schools</h3>
                <ul>
                  <li
                    onClick={openSchoolModal}
                    className="text-slate-600 items-center w-full flex gap-2 justify-start px-4 cursor-pointer lg:text-[15px]"
                  >
                    <i className="fa fa-plus text-slate-500"></i>
                    Create School
                  </li>
                </ul>
              </div>
              <hr />
              {!isFetchingData ? (
                displaySchools()
              ) : (
                <div className="text-center w-full pt-24">
                  <SpinnerLoader />
                </div>
              )}
            </div>
          </section>
          {addSchoolModal.isModalOpen &&
            createPortal(
              <AddSchool
                closeModal={() => addSchoolModal.setIsModalOpen(false)}
              />,
              document.body
            )}
        </Page>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center">
          <SpinnerLoader />
        </div>
      )}
    </div>
  );
};

export default Home;
