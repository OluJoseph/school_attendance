import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertSeverity, IAttendanceRecord, ILecture } from "../Util/constants";

import { AlertContext } from "../Util/context";
import SpinnerLoader from "./customLoader/SpinnerLoader";

import { get } from "../Util/api";

type LectureModalProps = {
  closeModal?: any;
  targetData: ILecture;
};

const Lecture = ({ closeModal, targetData }: LectureModalProps) => {
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const [records, setRecords] = useState<IAttendanceRecord[]>();

  const { setAlert } = useContext(AlertContext);

  function displayRecords() {
    const recordNodes = records?.map((record: IAttendanceRecord) => {
      return (
        <li key={record.lectureId} className="py-4 px-2 w-full border-b">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="cursor-pointer mr-4 text-blue-500 hover:text-blue-400 active:text-blue-700">
                {record.User?.fullname}, {record.Scholar?.schoolNumber}
              </p>
              <div>
                <span className="text-slate-700 text-sm mr-4">
                  In:{" "}
                  {record.timeIn &&
                    new Date(record.timeIn).toLocaleTimeString()}
                </span>
                <span className="text-slate-700 text-sm">
                  Out:{" "}
                  {record.timeOut &&
                    new Date(record.timeOut).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </li>
      );
    });
    return <ul className="w-full text-left px-4">{recordNodes}</ul>;
  }

  async function fetchLectureRecords() {
    try {
      const records = (
        await get(
          `/attendanceRecords/lecture/${targetData.courseEventId}/${targetData.lectureId}`
        )
      ).data;

      records && setRecords(records);
      setIsFetchingData(false);
    } catch (error) {
      setIsFetchingData(false);
      setAlert({
        message: "Error fetching attendance records",
        severity: AlertSeverity.error,
      });
    }
  }

  useEffect(() => {
    setIsFetchingData(true);
    fetchLectureRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal closeModal={closeModal}>
      <div className="w-full sm:h-[700px] overflow-clip flex flex-col">
        <h4 className="absolute top-[20px] left-[16px] font-semibold">
          <span className="font-semibold">{targetData.lectureName} </span>
        </h4>
        <hr className="mt-3 border-slate-100" />
        <div className="p-4 w-full">
          <span className="text-slate-700 text-sm">
            {new Date(targetData.start).toDateString()}
          </span>
          <br />
          <span className="text-slate-700 text-sm">
            {new Date(targetData.start).toLocaleTimeString()} -{" "}
            {new Date(targetData.end).toLocaleTimeString()}
          </span>
        </div>
        <div className="p-4 border-t border-b w-full mb-2">
          <p className="font-semibold">Attendance Records</p>
        </div>
        <div className="w-full sm:w-[540px] text-center relative overflow-auto">
          {isFetchingData && (
            <div className="absolute left-[47%] top-32">
              <SpinnerLoader />
            </div>
          )}
          {displayRecords()}
        </div>
      </div>
    </Modal>
  );
};

export default Lecture;
