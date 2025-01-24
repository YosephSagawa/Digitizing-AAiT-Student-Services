import React from "react";
import StudentAttendanceData from "../stores/StudentAttendanceData";

const ScanLog = () => {
  const data = StudentAttendanceData.Attendance;
  return (
    <div>
      {data.map((row) => (
        <div>
          <h1>{row.date}</h1>
          <p>{row.checkin}</p>
        </div>
      ))}
    </div>
  );
};

export default ScanLog;
