import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Page from "../../Components/Page";

import { AlertContext, ScholarContext, UserContext } from "../../Util/context";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";
import PageHeader from "../../Components/PageHeader";
import {
  AlertSeverity,
  IAttendee,
  ICourseEvent,
  ILecture,
  SchoolRoles,
  Tab,
} from "../../Util/constants";
import { get } from "../../Util/api";
import Tabs from "../../Components/tabs/Tabs";
import { useModal } from "../../Util/hooks";
import AddLecture from "../../Components/AddLecture";
import { createPortal } from "react-dom";
import Attendee from "../../Components/Attendee";
import Lecture from "../../Components/Lecture";

const Event = () => {
  const navigate = useNavigate();
  const { courseEventId, eventName } = useParams();

  const { scholar } = useContext(ScholarContext);
  const { user } = useContext(UserContext);

  const { setAlert } = useContext(AlertContext);
  const tabModal = useModal();
  const attendeeModal = useModal();
  const lectureModal = useModal();

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [attendee, setAttendee] = useState<IAttendee>();
  const [event, setEvent] = useState<ICourseEvent>();
  const [allLectures, setAllLectures] = useState<ILecture[]>([]);
  const [allAttendees, setAllAttendees] = useState<IAttendee[]>([]);

  const [targetData, setTargetData] = useState<any>(null);

  const [tab, switchTab] = useState("lectures");
  const tabs: Tab[] =
    scholar.role === SchoolRoles.admin || attendee?.role === "supervisor"
      ? [
          { id: "lectures", name: "Lectures" },
          { id: "attendees", name: "Attendees" },
        ]
      : [{ id: "lectures", name: "Lectures" }];

  const modalComponents: any = {
    lectures: (
      <AddLecture
        closeModal={() => tabModal.setIsModalOpen(false)}
        targetData={targetData}
      />
    ),
  };

  async function fetchData() {
    setIsFetchingData(true);
    try {
      // this order of logic is very critical: lecturer, then student, then admin
      const attendee = (
        await get(`courseEvent/${scholar.schoolId}/${courseEventId}`)
      ).data;

      let priority =
        scholar.role === SchoolRoles.admin ||
        (attendee.CourseEvent && attendee.role === "supervisor");

      let results: any = priority
        ? await Promise.all([
            await get(
              `courseEvent/attendee/allAttendees/${scholar.schoolId}/${courseEventId}`
            ),
            await get(
              `lecture/allLectures/${scholar.schoolId}/${courseEventId}`
            ),
          ])
        : await Promise.all([
            await get(
              `lecture/allLectures/${scholar.schoolId}/${courseEventId}`
            ),
          ]);

      if (!priority) {
        const [allLectures] = results;
        setAttendee(attendee);
        setAllLectures(allLectures.data);
        setEvent(attendee.CourseEvent);
      } else {
        const [allAttendees, allLectures] = results;
        if (attendee.CourseEvent) {
          setAttendee(attendee);
          setEvent(attendee.CourseEvent);
        } else {
          setEvent(attendee);
        }
        setAllAttendees(allAttendees.data);
        setAllLectures(allLectures.data);
      }
      setIsFetchingData(false);
    } catch (error) {
      setIsFetchingData(false);
      setAlert({
        message: "Error fetching event data",
        severity: AlertSeverity.error,
      });
    }
  }

  function displayLectures() {
    let lectureNodes = allLectures?.map((lecture: ILecture) => {
      return (
        <li key={lecture.lectureId} className="py-4 px-2 w-full border-b">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p
                onClick={() => {
                  lectureModal.setIsModalOpen(true);
                  setTargetData(lecture);
                }}
                className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700"
              >
                {lecture.lectureName}
              </p>
              <span className="text-slate-700 text-sm">
                {new Date(lecture.start).toDateString()}
              </span>
              <span className="text-slate-700 text-sm">
                {new Date(lecture.start).toLocaleTimeString()} -{" "}
                {new Date(lecture.end).toLocaleTimeString()}
              </span>
            </div>
            <span
              className={`${
                lecture.status === "ongoing"
                  ? "font-semibold text-slate-800"
                  : "text-slate-400"
              }`}
            >
              {lecture.status}
            </span>
          </div>
        </li>
      );
    });

    return <ul className="w-full text-left px-4">{lectureNodes}</ul>;
  }

  function displayAttendees() {
    let attendeeNodes = allAttendees?.map((attendee: IAttendee) => {
      return (
        <li
          key={attendee.attendeeInstanceId}
          className="py-4 px-2 w-full border-b"
        >
          <div className="flex justify-between">
            <h4 className="flex items-center">
              <p
                onClick={() => {
                  attendeeModal.setIsModalOpen(true);
                  setTargetData(attendee);
                }}
                className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700"
              >
                {attendee.User?.fullname}
              </p>
              <span className="text-slate-700">
                {attendee.Scholar?.schoolNumber}
              </span>
            </h4>
            <span className="text-slate-400 italic">
              {attendee.role === "supervisor" && attendee.role}
            </span>
          </div>
        </li>
      );
    });

    return <ul className="w-full text-left px-4">{attendeeNodes}</ul>;
  }

  useEffect(() => {
    if (scholar) {
      fetchData();
    } else {
      navigate(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <div className="flex flex-col h-full items-center">
        <PageHeader description={user?.fullname} />
        <hr className="w-full" />
        <section className="flex-1 h-full w-full pb-36 sm:px-[10%] lg:px-[20%] overflow-y-auto">
          <div className="flex items-center justify-between py-4">
            <div className="pl-4 text-left">
              <p className="font-semibold mb-2">
                {eventName}{" "}
                <span className="text-slate-500 italic font-normal text-sm">
                  ({event?.status})
                </span>
              </p>
              {event && (
                <p className="flex items-center gap-2 text-slate-500 text-sm">
                  <span>
                    Start: {new Date(event.startDate).toDateString()};
                  </span>
                  <span>End: {new Date(event.endDate).toDateString()} </span>
                </p>
              )}
            </div>
            <ul className="flex items-center gap-2">
              {scholar.role !== SchoolRoles.student && tab === "lectures" && (
                <li
                  onClick={() => {
                    tabModal.setIsModalOpen(true);
                    setTargetData(null);
                  }}
                  className={`text-slate-600 items-center w-full flex gap-2 justify-start px-4 cursor-pointer lg:text-[15px]`}
                >
                  <i className="fa fa-plus text-slate-400 text-lg sm:text-sm mr-4 sm:mr-0" />

                  <span className="hidden sm:block">New lecture</span>
                </li>
              )}
            </ul>
          </div>
          <hr />
          <div className="relative w-fit sm:w-[380px] pt-2">
            <Tabs
              id="schoolTabs"
              tabs={tabs}
              currentTab={tab}
              handleSwitch={switchTab}
              type="text"
            />
          </div>
          <hr />

          <div className="w-full text-center relative">
            {isFetchingData && (
              <div className="absolute left-[47%] top-32">
                <SpinnerLoader />
              </div>
            )}
            {tab === "lectures" ? displayLectures() : displayAttendees()}
          </div>
        </section>
        {tabModal.isModalOpen &&
          createPortal(modalComponents[tab], document.body)}
        {attendeeModal.isModalOpen &&
          createPortal(
            <Attendee
              closeModal={() => attendeeModal.setIsModalOpen(false)}
              targetData={targetData}
            />,
            document.body
          )}
        {lectureModal.isModalOpen &&
          createPortal(
            <Lecture
              closeModal={() => lectureModal.setIsModalOpen(false)}
              targetData={targetData}
            />,
            document.body
          )}
      </div>
    </Page>
  );
};

export default Event;
