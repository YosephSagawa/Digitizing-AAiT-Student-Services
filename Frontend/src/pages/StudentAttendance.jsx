import Navbar from "../components/Navbar";

//Data
import StudentAttendanceData from "../stores/StudentAttendanceData";

//Components
import AttendanceTable from "../components/AttendanceTable";

const StudentAttendance = () => {
  return (
    <div>
      <Navbar />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            ATTENDANCE
          </h1>
          <p className="w-fit p-1 text-gray-400 font-medium">
            Last Updated: Sept 2024
          </p>
        </div>
      </div>
      <AttendanceTable data={StudentAttendanceData.Attendance} />
    </div>
  );
};

export default StudentAttendance;
