import React, { useState, useEffect } from "react";
import { getInstructorProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ClassCard from "../components/ClassCard";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LecturerDashboard = () => {
  const [instructor, setInstructor] = useState(null);
  const [classData, setClassData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClass, setSelectedClass] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const data = await getInstructorProfile();
        setInstructor(data.profile.instructor);
        setClassData(data.profile.classes);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };

    fetchInstructorData();
  }, []);

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

  const filteredData = classData.filter((item) =>
    item.attendance.some((att) => {
      const date = new Date(att.date);
      const matchesDate =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      const matchesClass =
        selectedClass === "All" || item.class_name === selectedClass;
      return matchesDate && matchesClass;
    })
  );

  const attendanceCards = [];

  filteredData.forEach((classItem) => {
    classItem.attendance.forEach((att) => {
      const date = new Date(att.date);
      const matchesDate =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);

      if (matchesDate) {
        attendanceCards.push({
          className: classItem.class_name,
          date: att.date,
          attendance: classItem.attendance.filter((a) => a.date === att.date),
          fullClassData: classItem,
        });
      }
    });
  });

  const uniqueCards = Array.from(
    new Set(attendanceCards.map((i) => `${i.className}|${i.date}`))
  )
    .map((key) => {
      const [className, date] = key.split("|");
      const original = attendanceCards.find(
        (i) => i.className === className && i.date === date
      );
      return {
        className,
        date,
        attendance: original.attendance,
        fullClassData: original.fullClassData,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCardClick = (classItem) => {
    navigate(`/attendance-details/${classItem.className}/${classItem.date}`, {
      state: {
        attendance: classItem.attendance,
        classInfo: classItem.fullClassData,
      },
    });
  };

  const classOptions = [
    "All",
    ...new Set(classData.map((item) => item.class_name)),
  ];

  return (
    <div>
      <Navbar name={instructor?.first_name} photo={instructor?.image} />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Welcome, {instructor?.first_name}
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
              placeholderText="Start Date"
              className="border p-2 rounded"
            />
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="End Date"
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
            {classOptions.map((className, idx) => (
              <option key={idx} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {uniqueCards.map((item, idx) => (
            <ClassCard
              key={`${item.className}-${item.date}-${idx}`}
              className={item.className}
              date={item.date}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
