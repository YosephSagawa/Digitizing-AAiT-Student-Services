import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ClassCard from "../components/ClassCard";
import ClassAttendanceData from "../stores/ClassAttendanceData";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LecturerDashboard = () => {
  const data = ClassAttendanceData.studentData;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("All");
  const navigate = useNavigate();

  // Handle redirect to class attendance detail page
  const handleCardClick = (className, date) => {
    navigate(`/attendance/${className}/${date}`);
  };

  // Date filtering functions for quick buttons
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

  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.date);

    const matchesDateRange =
      (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);

    const matchesClass =
      selectedClass === "All" || row.className === selectedClass;

    return matchesDateRange && matchesClass;
  });

  // Extract unique class names for the dropdown
  const classOptions = [
    "All",
    ...new Set(ClassAttendanceData.studentData.map((row) => row.className)),
  ];
  console.log(filteredData);

  return (
    <div>
      <Navbar />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Lecturer Dashboard
          </h1>
        </div>

        {/* Filter Section */}
        <div className="flex sm:flex-row flex-col gap-2 sm:mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
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

          <div className="flex flex-col sm:flex-row gap-3 items-center">
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

        {/* Class Dropdown */}
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

        {/* Class Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {filteredData.map((item) => (
              <ClassCard
                key={item.id}
                className={item.className}
                date={item.date}
                onClick={() => handleCardClick(item.className, item.date)}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
