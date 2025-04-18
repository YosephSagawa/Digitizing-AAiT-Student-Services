import { useState } from "react";
import ProfileImage from "../assets/ProfileIcon.png";
import Downarrow from "../assets/Downarrow.svg";
import Uparrow from "../assets/Uparrow.svg";
import Checkbox from "./Checkbox";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AttendanceTable = ({ data }) => {
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(false);
  const [late, setLate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("All");

  // Extract unique class names for dropdown
  const classOptions = [
    "All",
    ...new Set(
      data.map((row) => row.class_instance?.class_name).filter(Boolean)
    ),
  ];

  // Toggle attendance visibility
  const toggleAttendance = () => setIsAttendanceVisible(!isAttendanceVisible);
  const togglePresent = () => setPresent(!present);
  const toggleAbsent = () => setAbsent(!absent);
  const toggleLate = () => setLate(!late);

  // Date filtering functions
  const filterByThisMonth = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  };

  const filterByThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
  };

  const filterByThisYear = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), 0, 1));
    setEndDate(new Date(now.getFullYear(), 11, 31));
  };

  // Filter data based on selected criteria
  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.date);
    const status = row.status?.toLowerCase();

    const matchesFilters =
      (present && status === "present") ||
      (absent && status === "absent") ||
      (late && status === "late") ||
      (!present && !absent && !late);

    const matchesDateRange =
      (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);

    const matchesClass =
      selectedClass === "All" ||
      row.class_instance?.class_name === selectedClass;

    return matchesFilters && matchesDateRange && matchesClass;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row p-8">
        <button onClick={toggleAttendance} className="mb-6 sm:mb-0">
          <img
            src={
              data[0]?.student?.image
                ? data[0].student.image.startsWith("http")
                  ? data[0].student.image
                  : `http://localhost:8000${data[0].student.image}`
                : ProfileImage
            }
            alt="User Picture"
            className="w-14 h-14 inline rounded-full"
          />
          <span className="ml-2 sm:text-2xl text-xl text-[#252C58]">
            Attendance Overview
          </span>
          <img
            src={isAttendanceVisible ? Uparrow : Downarrow}
            alt="Toggle Arrow"
            className="w-10 h-10 ml-2 inline"
          />
        </button>

        <div className="flex sm:flex-row flex-col sm:ml-auto gap-2 font-Montserrat text-[#20285A] sm:items-center items-start">
          <p>
            <Checkbox value={isAttendanceVisible} setValue={toggleAttendance} />
            All
          </p>
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
      </div>

      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-4 px-8 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center ">
            <ReactDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date (MM/DD/YYYY)"
              className="border p-2 rounded"
            />
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="End Date (optional)"
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-row gap-2">
            <button
              onClick={filterByThisMonth}
              className="bg-picosun text-black px-4 py-2 rounded"
            >
              This Month
            </button>
            <button
              onClick={filterByThisWeek}
              className="bg-midblue text-white px-4 py-2 rounded"
            >
              This Week
            </button>
            <button
              onClick={filterByThisYear}
              className="bg-radishred text-white px-4 py-2 rounded"
            >
              This Year
            </button>
          </div>
        </div>

        <div className="flex flex-col px-8 mb-4 w-fit">
          <label htmlFor="classFilter" className="font-semibold mb-2">
            Filter by Class Name:
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded"
          >
            {classOptions.map((className, index) => (
              <option key={index} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isAttendanceVisible && (
        <div className="font-Montserrat p-4 overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-white text-left border-t">
                <th className="py-3 px-4 border-b-2 font-bold text-md">Date</th>
                <th className="py-3 px-4 border-b-2 font-bold text-md">Day</th>
                <th className="py-3 px-4 border-b-2 font-bold text-md">
                  Class Name
                </th>
                <th className="py-3 px-4 border-b-2 font-bold text-md">
                  Check-in
                </th>
                <th className="py-3 px-4 border-b-2 font-bold text-md">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => {
                const timeIn = new Date(row.time_in).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const status = row.status?.toLowerCase();

                return (
                  <tr key={row.attendance_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{row.date}</td>
                    <td className="py-3 px-4 border-b">
                      {new Date(row.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {row.class_instance?.class_name || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">{timeIn}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`block px-1 py-2 shadow-md text-xs font-semibold text-center capitalize ${
                          status === "absent"
                            ? "bg-radishred text-white"
                            : status === "present"
                            ? "bg-midblue text-white"
                            : "bg-picosun text-black"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
