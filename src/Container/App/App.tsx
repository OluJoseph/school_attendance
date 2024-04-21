import React, { Suspense, useEffect, useMemo, useState } from "react";

import "./App.css";

// components
import AppRoutes from "../../Routes/AppRoutes";
import { AlertContext, ApiErrorContext, UserContext } from "../../Util/context";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";
import CustomSnackbar from "../../Components/customSnackbar/CustomSnackbar";
import { get } from "../../Util/api";
import { IUser } from "../../Util/constants";
import { logout } from "../../Util/util";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("amsUser");

  const [user, setUser] = useState<any>();

  const [networkError, setNetworkError] = useState<boolean>(false);
  const [timeout, setTimeout] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>();

  const alertProviderValue = useMemo(() => {
    return { alert: alert, setAlert: setAlert };
  }, [alert]);

  function refereshPage() {
    window.location.reload();
  }

  async function fetchUser() {
    try {
      const response = await get(`user`);
      const user: IUser = response.data;

      user && setUser(user);
    } catch (error) {}
  }

  useEffect(() => {
    if (userToken) {
      fetchUser();
    } else {
      logout(setUser, navigate);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ApiErrorContext.Provider
        value={{
          networkError: networkError,
          setNetworkError: setNetworkError,
          timeout: timeout,
          setTimeout: setTimeout,
        }}
      >
        <AlertContext.Provider value={alertProviderValue}>
          <div className="App relative">
            {!user && userToken && (
              <div className="absolute h-full w-full flex items-center justify-center">
                <SpinnerLoader />
              </div>
            )}
            <AppRoutes />
            <CustomSnackbar />
          </div>
        </AlertContext.Provider>
        {networkError && (
          <div className="fixed top-0 left-0 z-20 w-screen h-screen flex justify-center bg-white pt-32">
            <div className="px-4 h-[200px] flex flex-col items-center justify-center">
              <i className="fa fa-exclamation-triangle text-slate-300 text-2xl mb-4"></i>
              <h2 className="mb-6 text-2xl text-slate-500 font-extrabold">
                Oops! Network Error!
              </h2>
              <p className="text-slate-500 text-center">
                Your connection was interrupted
                <br />
                Please check your internet connection or <br />
                <span
                  onClick={refereshPage}
                  className="text-full text-blue-500 cursor-pointer active:text-blue-300 active:bg-transparent"
                >
                  Referesh this page
                </span>
              </p>
            </div>
          </div>
        )}
        {timeout && (
          <div className="fixed top-0 left-0 z-20 w-screen h-screen flex justify-center bg-white pt-32">
            <div className="px-4 h-[200px] flex flex-col items-center justify-center">
              <i className="fa fa-exclamation-triangle text-slate-300 text-2xl mb-4"></i>
              <h2 className="mb-6 text-2xl text-slate-500 text-center font-bold">
                Page took too long to respond
              </h2>

              <p
                onClick={refereshPage}
                className="text-full text-blue-500 cursor-pointer active:text-blue-300 active:bg-transparent"
              >
                Referesh this page
              </p>
            </div>
          </div>
        )}
      </ApiErrorContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
