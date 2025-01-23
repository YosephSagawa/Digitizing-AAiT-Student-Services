import React from "react";

//Components
import ClassAttendanceData from "../stores/ClassAttendanceData";
import ClassAttendanceTable from "../components/ClassAttendanceTable";
import Navbar from "../components/Navbar";

const LecturerDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Lecturer Dashboard
          </h1>
        </div>
        <div>
          <ClassAttendanceTable data={ClassAttendanceData.studentData} />
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
