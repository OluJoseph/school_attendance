import React from "react";
import { AlertProps, IScholar, IUser, SchoolRoles } from "./constants";

export const UserContext = React.createContext({
  user: {
    userId: "",
    email: "",
    fullname: "",
    verified: false,
    isActive: false,
  },
  setUser: (val: IUser) => {},
});

export const ScholarContext = React.createContext({
  scholar: {
    scholarId: "",
    schoolNumber: "",
    tagId: "",
    bluetoothId: "",
    enrolled: false,
    userId: "",
    User: {
      fullname: "",
    },
    schoolId: "",
    role: SchoolRoles.student,
    School: {
      schoolId: "",
      schoolName: "",
    },
  },
  setScholar: (val: IScholar) => {},
});

export const ApiErrorContext = React.createContext({
  networkError: false,
  setNetworkError: (val: boolean) => {},
  timeout: false,
  setTimeout: (val: boolean) => {},
});

export const AlertContext = React.createContext({
  alert: { message: "", severity: undefined },
  // eslint-disable-next-line
  setAlert: (val: AlertProps) => {},
});
