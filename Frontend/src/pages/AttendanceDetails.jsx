import React, { useState, useEffect } from "react";
import { exportAttendanceToCSV } from "../utils/exportToCSV";
import { useParams, useLocation } from "react-router-dom";
import Checkbox from "../components/Checkbox";
import axios from "axios";

const AttendanceDetails = () => {
  const { className, date } = useParams();
  const location = useLocation();
  const attendanceFromRoute = location.state?.attendance || [];

  const [attendanceData, setAttendanceData] = useState([]);
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(false);
  const [late, setLate] = useState(false);

  useEffect(() => {
    const filtered = attendanceFromRoute.filter((item) => item.date === date);
    setAttendanceData(filtered);
  }, [attendanceFromRoute, date]);

  const togglePresent = () => setPresent(!present);
  const toggleAbsent = () => setAbsent(!absent);
  const toggleLate = () => setLate(!late);

  const filteredData = attendanceData.filter((item) => {
    return (
      (present && item.status === "present") ||
      (absent && item.status === "absent") ||
      (late && item.status === "late") ||
      (!present && !absent && !late)
    );
  });

  const handleDownloadCSV = () => {
    exportAttendanceToCSV(className, date, filteredData);
  };

  const handleSendReport = async () => {
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://localhost:8000/api/send-report/",
        {
          class_name: className,
          date: date,
          attendance: filteredData.map((record) => ({
            student_name: `${record.student.first_name} ${record.student.last_name}`,
            student_id: record.student.student_id,
            date: record.date,
            status: record.status,
            time_in: record.time_in,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Report sent to course coordinator!");
    } catch (err) {
      console.error(err);
      alert("Failed to send report.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-[#252C58] my-4">
        Attendance for {className} on {new Date(date).toLocaleDateString()}
      </h1>

      <div className="flex gap-4 mt-10 mb-6 text-[#20285A]">
        <p>Filter by attendance status:</p>
        <p>
          <Checkbox value={present} setValue={togglePresent} /> Present
        </p>
        <p>
          <Checkbox value={absent} setValue={toggleAbsent} /> Absent
        </p>
        <p>
          <Checkbox value={late} setValue={toggleLate} /> Late
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="mb-2">
          <button
            className="bg-midblue text-white hover:bg-blue-950 px-4 py-2 rounded-xl mr-4"
            onClick={handleDownloadCSV}
          >
            Download CSV
          </button>
          <button
            className="bg-radishred text-white hover:bg-red-900 px-4 py-2 rounded-xl"
            onClick={handleSendReport}
          >
            Send Report to Coordinator
          </button>
        </div>

        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-white text-left border-t">
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time In</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((att) => (
              <tr key={att.attendance_id} className="border-t">
                <td className="px-4 py-2">
                  {att.student.first_name} {att.student.last_name}
                </td>
                <td className="px-4 py-2">{att.date}</td>
                <td className="px-4 py-2">
                  {new Date(att.time_in).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 capitalize">{att.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDetails;
