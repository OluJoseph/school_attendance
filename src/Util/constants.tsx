import { UUID } from "crypto";

// enum
export enum AlertSeverity {
  success = "success",
  info = "info",
  warning = "warning",
  error = "error",
}

export enum SchoolRoles {
  admin = "admin",
  lecturer = "lecturer",
  student = "student",
}

export enum DeviceMode {
  enrollment = "enrollment",
  attendance = "attendance",
}

export enum EventStatus {
  pending = "pending",
  ongoing = "ongoing",
  ended = "ended",
  cancelled = "cancelled",
}

export enum EventRole {
  supervisor = "supervisor",
  attendee = "attendee",
}

export enum Use {
  RFID = "RFID",
  Bluetooth = "Bluetooth",
}

// icons
export const arrowIconGrey = (
  <svg
    width="33"
    height="42"
    viewBox="0 0 33 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.6">
      <path
        d="M13.29 38.1902C13.29 38.1902 25.4154 35.7802 17.4444 24.4489C14.8865 19.0678 11.5264 12.7968 19.2523 10.0029C25.433 7.76771 28.5682 14.4089 26.0621 18.2552C23.5559 22.1015 15.9138 20.0098 12.3444 14.3921C10.9277 11.7994 8.30187 6.00825 9.13188 3.58522"
        stroke="#D9D9D9"
      />
      <path
        d="M8.50482 39.4103L13.8429 40.3684L12.7397 36.0223L8.50482 39.4103Z"
        fill="#D9D9D9"
      />
    </g>
  </svg>
);

export const arrowIconYellow = (
  <svg
    width="60"
    height="57"
    viewBox="0 0 60 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.5">
      <path
        d="M21.9147 53.8529C19.5625 34.7619 27.4369 26.8251 35.3038 24.9915C43.1707 23.158 51.0225 33.531 43.0319 36.0607C35.0412 38.5905 29.9043 19.0045 39.7899 7.83415"
        stroke="#FFD600"
      />
      <path
        d="M40.9393 4.73431L36.0393 7.74529L41.2641 10.4763L40.9393 4.73431Z"
        fill="#FFD600"
      />
    </g>
  </svg>
);

// types
export type AlertProps = {
  message: string;
  severity: AlertSeverity | undefined;
};

export type Tab = {
  id: string;
  name: string;
};

export type TabsProps = {
  id: string;
  tabs: Tab[];
  currentTab: string;
  handleSwitch: any;
  type?: string;
};

// Interface
export interface IAttendanceRecord {
  lectureId: UUID;
  courseEventId: UUID;
  scholarId: UUID;
  timeIn: Date;
  timeOut: Date;
  Scholar?: IScholar;
  userId: UUID;
  User?: IUser;
}

export interface IUser {
  userId: string;
  email: string;
  fullname: string;
  verified: boolean;
  isActive: boolean;
}

export interface IScholar {
  scholarId: UUID;
  schoolNumber: string;
  tagId: string;
  bluetoothId: string;
  enrolled: boolean;
  userId: UUID;
  User?: IUser;
  schoolId: UUID;
  School?: ISchool;
  role: SchoolRoles;
}

export interface ISchool {
  schoolId: UUID;
  schoolName: string;
  admin: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDevice {
  deviceId: UUID;
  deviceName: string;
  mode: DeviceMode;
  courseEventId: UUID;
  schoolId: UUID;
  use: Use;
}

export interface ICourseEvent {
  courseEventId: UUID;
  schoolId: UUID;
  School?: ISchool;
  supervisor: UUID;
  eventName: string;
  courseCode: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
}

export interface IAttendee {
  attendeeInstanceId: UUID;
  schoolId: UUID;
  School?: ISchool;
  userId: UUID;
  User?: IUser;
  scholarId: UUID;
  Scholar?: IScholar;
  role: EventRole;
  isActive: boolean;
  courseEventId: UUID;
  CourseEvent?: ICourseEvent;
}

export interface ILecture {
  lectureId: UUID;
  start: Date;
  end: Date;
  status: EventStatus;
  courseEventId: UUID;
  CourseEvent?: ICourseEvent;
  lectureName: string;
}

export interface IAttendanceRecord {
  lectureId: UUID;
  courseEventId: UUID;
  scholarId: UUID;
  Lecture?: ILecture;
  timeIn: Date;
  timeOut: Date;
}
