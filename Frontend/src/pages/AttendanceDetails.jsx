import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClassAttendanceData from "../stores/ClassAttendanceData";
import Checkbox from "../components/Checkbox";

const AttendanceDetails = () => {
  const { className, date } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(false);
  const [late, setLate] = useState(false);

  const [checkboxStatus, setCheckboxStatus] = useState([]);

  useEffect(() => {
    const filtered = ClassAttendanceData.studentData.filter(
      (item) => item.className === className && item.date === date
    );
    setAttendanceData(filtered);
    setCheckboxStatus(
      filtered.map((item) => ({
        id: item.id,
        isChecked: item.status === "Present" || item.status === "Late",
      }))
    );
  }, [className, date]);

  const togglePresent = () => setPresent(!present);
  const toggleAbsent = () => setAbsent(!absent);
  const toggleLate = () => setLate(!late);

  const handleCheckboxChange = (id) => {
    setCheckboxStatus((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const filteredData = attendanceData.filter((item) => {
    return (
      (present && item.status === "Present") ||
      (absent && item.status === "Absent") ||
      (late && item.status === "Late") ||
      (!present && !absent && !late)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#252C58] my-4">
        Attendance for {className} on {new Date(date).toLocaleDateString()}
      </h1>

      <div className="flex gap-4 mt-10 mb-6 text-[#20285A]">
        <p>Filter by attendance status:</p>
        <p>
          <Checkbox value={present} setValue={togglePresent} />
          Present
        </p>
        <p>
          <Checkbox value={absent} setValue={toggleAbsent} />
          Absent
        </p>
        <p>
          <Checkbox value={late} setValue={toggleLate} />
          Late
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-white text-left border-t">
              <th className="py-3 px-4 border-b-2 font-bold text-md">Mark</th>
              <th className="py-3 px-4 border-b-2 font-bold text-md">
                Student Name
              </th>
              <th className="py-3 px-4 border-b-2 font-bold text-md">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={
                      checkboxStatus.find((row) => row.id === item.id)
                        ?.isChecked || false
                    }
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                <td className="py-3 px-4 border-b">{item.studentName}</td>
                <td className="py-3 px-4 border-b">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDetails;
