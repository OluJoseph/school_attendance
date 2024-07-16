import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Page from "../../Components/Page";

import { AlertContext, ScholarContext, UserContext } from "../../Util/context";
import SpinnerLoader from "../../Components/customLoader/SpinnerLoader";
import PageHeader from "../../Components/PageHeader";
import {
  AlertSeverity,
  IDevice,
  IScholar,
  SchoolRoles,
  Tab,
} from "../../Util/constants";
import { get } from "../../Util/api";
import Tabs from "../../Components/tabs/Tabs";
import { useModal } from "../../Util/hooks";
import { createPortal } from "react-dom";
import AddEvent from "../../Components/AddEvent";
import AddScholar from "../../Components/AddScholar";
import AddDevice from "../../Components/AddDevice";
import AddAttendee from "../../Components/AddAttendee";

const School = () => {
  const navigate = useNavigate();

  const { scholar } = useContext(ScholarContext);
  const { user } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [allScholars, setAllScholars] = useState<IScholar[]>([]);
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  const [tab, switchTab] = useState("courseEvents");
  const tabs: Tab[] =
    scholar.role === SchoolRoles.admin
      ? [
          { id: "courseEvents", name: "Events" },
          { id: "scholars", name: "Scholars" },
          { id: "devices", name: "Devices" },
        ]
      : [{ id: "courseEvents", name: "Events" }];

  const { isModalOpen, setIsModalOpen } = useModal();
  const registerAttendeeEventModal = useModal();

  const [targetData, setTargetData] = useState<any>(null);

  const modalComponents: any = {
    courseEvents: (
      <AddEvent
        closeModal={() => setIsModalOpen(false)}
        targetData={targetData}
		callbackOnSave={fetchData}
      />
    ),
    scholars: (
      <AddScholar
        closeModal={() => setIsModalOpen(false)}
        targetData={targetData}
		callbackOnSave={fetchData}
      />
    ),
    devices: (
      <AddDevice
        closeModal={() => setIsModalOpen(false)}
        targetData={targetData}
        allEvents={allEvents}
		callbackOnSave={fetchData}
      />
    ),
  };

  async function fetchData() {
    setIsFetchingData(true);
    try {
      let results: any;
      if (scholar.role === SchoolRoles.admin) {
        results = await Promise.all([
          await get(`scholar/allScholars/${scholar.schoolId}`),
          await get(`device/allDevices/${scholar.schoolId}`),
          await get(`courseEvent/allEvents/${scholar.schoolId}`),
        ]);
      } else {
        results = await Promise.all([
          await get(`courseEvent/userEvents/${scholar.schoolId}`),
        ]);
      }

      setIsFetchingData(false);
      if (scholar.role === SchoolRoles.admin) {
        const [allScholars, allDevices, allEvents] = results;
        setAllScholars(allScholars.data);
        setAllDevices(allDevices.data);
        setAllEvents(allEvents.data);
      } else {
        const [allEvents] = results;
        setAllEvents(allEvents.data);
      }
    } catch (error) {
      setIsFetchingData(false);
      setAlert({
        message: "Error fetching school data",
        severity: AlertSeverity.error,
      });
    }
  }

  function displayScholars() {
    let scholarNodes = allScholars?.map((scholar: IScholar) => {
      return (
        <li key={scholar.scholarId} className="py-4 px-4 w-full border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <p
                  onClick={() => {
                    setIsModalOpen(true);
                    setTargetData(scholar);
                  }}
                  className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700"
                >
                  {scholar?.User?.fullname}
                </p>
                <span className="text-slate-700">
                  {scholar.schoolNumber || scholar.role}
                </span>
              </div>
            </div>
            <span
              onClick={() => {
                registerAttendeeEventModal.setIsModalOpen(true);
                setTargetData(scholar);
              }}
              className="text-sm cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700"
            >
              register events
            </span>
          </div>
        </li>
      );
    });

    return <ul className="w-full text-left">{scholarNodes}</ul>;
  }

  function displayDevices() {
    let deviceNodes = allDevices?.map((device: IDevice) => {
      return (
        <li key={device.deviceId} className="py-4 px-4 w-full border-b">
          <div className="flex justify-between">
            <h4 className="flex items-center">
              <p
                onClick={() => {
                  setIsModalOpen(true);
                  setTargetData(device);
                }}
                className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700"
              >
                {device.deviceName}
              </p>
              <span className="text-slate-500 text-sm">{device.mode} mode</span>
            </h4>
            <span className="text-slate-400 italic">
              {device.courseEventId ? "in use" : "available"}
            </span>
          </div>
        </li>
      );
    });

    return <ul className="w-full text-left">{deviceNodes}</ul>;
  }

  function displayEvents() {
    let eventNodes = allEvents?.map((event: any) => {
      event = event.CourseEvent || event;
      return (
        <li key={event.courseEventId} className="py-4 px-4 w-full border-b">
          <div className="flex justify-between">
            <div>
              <p
                onClick={() => {
                  navigate(`${event.eventName}/${event.courseEventId}`);
                }}
                className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700"
              >
                {event.eventName}
              </p>
              <span className="text-slate-700">{event.courseCode}</span>
            </div>
            <span className="text-slate-400 italic">{event.status}</span>
          </div>
        </li>
      );
    });

    return <ul className="w-full text-left">{eventNodes}</ul>;
  }

  useEffect(() => {
    if (scholar) {
      fetchData();
    } else {
      navigate("home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <div className="flex flex-col h-full items-center">
        <PageHeader description={user?.fullname} />

        <hr className="w-full" />

        <section className=" w-full h-full flex flex-col pb-10 sm:px-[10%] lg:px-[20%] overflow-y-clip">
          <div className="flex items-center justify-between py-4">
            <p className="font-semibold px-4">{scholar.School?.schoolName}</p>
            <ul className="flex items-end gap-2">
              {
                <li
                  onClick={() => {
                    setIsModalOpen(true);
                    setTargetData(null);
                  }}
                  className={`${
                    scholar.role === SchoolRoles.admin ||
                    (scholar.role === SchoolRoles.lecturer &&
                      tab === "courseEvents")
                      ? "flex"
                      : "hidden"
                  } text-slate-600 items-center w-full gap-2 justify-start px-4 cursor-pointer lg:text-[15px]`}
                >
                  <i className="fa fa-plus text-slate-400" />
                  New{" "}
                  {tab === "courseEvents"
                    ? "Event"
                    : tab === "scholars"
                    ? "Scholar"
                    : "Device"}
                </li>
              }
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

          <div className="w-full flex-1 text-center relative overflow-y-auto">
            {isFetchingData && (
              <div className="absolute left-[47%] top-32 ">
                <SpinnerLoader />
              </div>
            )}
            {tab === "scholars"
              ? displayScholars()
              : tab === "devices"
              ? displayDevices()
              : tab === "courseEvents"
              ? displayEvents()
              : []}
          </div>
        </section>
        {isModalOpen && createPortal(modalComponents[tab], document.body)}
        {registerAttendeeEventModal.isModalOpen &&
          createPortal(
            <AddAttendee
              closeModal={() =>
                registerAttendeeEventModal.setIsModalOpen(false)
              }
              allEvents={allEvents}
              targetScholar={targetData}
            />,
            document.body
          )}
      </div>
    </Page>
  );
};

export default School;
