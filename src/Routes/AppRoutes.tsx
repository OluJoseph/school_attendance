import React from "react";
import { useRoutes } from "react-router-dom";

import Login from "../Features/Auth/Login";

import NotFound from "../Components/NotFound";
import Signup from "../Features/Auth/Signup";

import { SchoolRoles } from "../Util/constants";
import Home from "../Features/Home/Home";
import School from "../Features/School/School";
import SchoolLayout from "../Container/Layout/SchoolLayout";
import Event from "../Features/Event/Event";

const AppRoutes = () => {
  let routes: any = [];
  let savedScholar = sessionStorage.getItem("scholar");
  let scholarInfo;
  if (savedScholar) {
    scholarInfo = JSON.parse(savedScholar);
  }

  const commonRoutes = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  const scholarRoutes: any[] = [
    {
      path: "/:schoolName",
      element: <SchoolLayout />,
      children: [
        {
          path: "",
          element: <School />,
        },
        {
          path: ":eventName/:courseEventId",
          element: <Event />,
        },
      ],
    },
  ];

  const adminRoutes: any[] = [
    {
      path: "/:schoolName",
      element: <SchoolLayout />,
      children: [
        {
          path: "",
          element: <School />,
        },
        {
          path: ":eventName/:courseEventId",
          element: <Event />,
        },
      ],
    },
  ];

  if (scholarInfo) {
    routes =
      scholarInfo.role === SchoolRoles.admin ? adminRoutes : scholarRoutes;
  }

  const children = useRoutes([...commonRoutes, ...routes]);

  return <div>{children}</div>;
};

export default AppRoutes;
