// Images
import ProfileImage from "../assets/ProfileIcon.png";
import Downarrow from "../assets/Downarrow.svg";
import Uparrow from "../assets/Uparrow.svg";
import { useState } from "react";
import Checkbox from "./Checkbox";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * AttendanceTable
 *
 * This component renders a table with the attendance data, with filters and sorting capabilities.
 *
 * @param {object} data - The attendance data to be rendered in the table.
 * @returns {JSX.Element} The rendered table.
 */
const AttendanceTable = ({ data }) => {
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(false);
  const [fromHome, setFromHome] = useState(false);
  const [late, setLate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /**
   * Toggle the visibility of the attendance table.
   */
  const toggleAttendance = () => {
    setIsAttendanceVisible(!isAttendanceVisible);
  };

  /**
   * Toggle the 'Present' filter.
   */
  const togglePresent = () => setPresent(!present);

  /**
   * Toggle the 'Absent' filter.
   */
  const toggleAbsent = () => setAbsent(!absent);

  /**
   * Toggle the 'Work from Home' filter.
   */
  const toggleFromHome = () => setFromHome(!fromHome);

  /**
   * Toggle the 'Late' filter.
   */
  const toggleLate = () => setLate(!late);

  /**
   * Filter the attendance data by the current month.
   */
  const filterByThisMonth = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  };

  /**
   * Filter the attendance data by the current week.
   */
  const filterByThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
  };

  /**
   * Filter the attendance data by the current year.
   */
  const filterByThisYear = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), 0, 1));
    setEndDate(new Date(now.getFullYear(), 11, 31));
  };

  /**
   * Filter the attendance data by the current filters and date range.
   * @returns {array} The filtered attendance data.
   */
  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.date);
    const matchesFilters =
      (present && row.status === "Work from Office") ||
      (absent && row.status === "Absent") ||
      (fromHome && row.status === "Work from Home") ||
      (late && row.status === "Late Arrival") ||
      (!present && !absent && !fromHome && !late);

    const matchesDateRange =
      (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);

    return matchesFilters && matchesDateRange;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row p-8">
        <button onClick={toggleAttendance} className="mb-6 sm:mb-0">
          <img
            src={ProfileImage}
            alt="User Picture"
            className="w-14 h-14 inline"
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
            <Checkbox value={fromHome} setValue={toggleFromHome} />
            From Home
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

      <div className="flex flex-col sm:flex-row items-center gap-4 px-8 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center ">
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date(MM/DD/YYYY)"
            className="border p-2 rounded"
          />
          <ReactDatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date(optional)"
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-row gap-2">
          <button
            onClick={filterByThisMonth}
            className="bg-[#96B85C] text-white px-4 py-2 rounded"
          >
            This Month
          </button>
          <button
            onClick={filterByThisWeek}
            className="bg-[#00bade] text-white px-4 py-2 rounded"
          >
            This Week
          </button>
          <button
            onClick={filterByThisYear}
            className="bg-[#ff5349] text-white px-4 py-2 rounded"
          >
            This Year
          </button>
        </div>
      </div>

      {isAttendanceVisible && (
        <div className="font-Montserrat p-4 overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-white text-left border-t">
                <th className="py-3 px-4 border-b-2">
                  <p className="font-bold text-md">Date</p>
                </th>
                <th className="py-3 px-4 border-b-2">
                  <p className="font-bold text-md">Day</p>
                </th>
                <th className="py-3 px-4 border-b-2">
                  <p className="font-bold text-md">Check-in</p>
                </th>
                <th className="py-3 px-4 border-b-2">
                  <p className="font-bold text-md">Check-out</p>
                </th>
                <th className="py-3 px-4 border-b-2">
                  <p className="font-bold text-md">Work-hours</p>
                </th>
                <th className="py-3 px-4 border-b-2">
                  <p className="font-bold text-md">Status</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-normal">{row.date}</td>
                  <td className="py-3 px-4 border-b font-normal">{row.day}</td>
                  <td
                    className={`py-3 px-4 border-b font-normal ${
                      row.status === "Work from Office"
                        ? "text-blue-800"
                        : row.status === "Work from Home"
                        ? "text-gray-500"
                        : row.status === "Late Arrival"
                        ? "text-yellow-400"
                        : row.status === "Absent"
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {row.checkin}
                  </td>
                  <td
                    className={`py-3 px-4 border-b font-normal ${
                      row.status === "Work from Office"
                        ? "text-blue-800"
                        : row.status === "Work from Home"
                        ? "text-gray-500"
                        : row.status === "Late Arrival"
                        ? "text-blue-800"
                        : "text-red-800"
                    }`}
                  >
                    {row.checkout}
                  </td>
                  <td className="py-3 px-4 border-b font-normal">
                    {row.workHours}
                  </td>
                  <td className="py-3 px-4 border-b font-normal">
                    <span
                      className={`block px-1 py-2 shadow-md text-xs font-semibold text-center ${
                        row.status === "Absent"
                          ? "bg-high text-red-800"
                          : row.status === "Work from Office"
                          ? "bg-low text-blue-800"
                          : row.status === "Late Arrival"
                          ? "bg-middle text-yellow-800"
                          : "bg-wfhome text-gray-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
