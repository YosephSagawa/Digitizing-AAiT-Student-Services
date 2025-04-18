import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

//Components
import AttendanceTable from "../components/AttendanceTable";

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchAttendance = async () => {
      try {
        const profileRes = await axios.get(
          "http://localhost:8000/api/auth/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const studentId = profileRes.data.profile.student.student_id;

        const attendanceRes = await axios.get(
          `http://localhost:8000/api/attendance/?student__student_id=${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAttendanceData(attendanceRes.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, []);

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
      <AttendanceTable data={attendanceData} />
    </div>
  );
};

export default StudentAttendance;
