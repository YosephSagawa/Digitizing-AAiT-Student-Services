import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Checkbox from "../components/Checkbox";

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
