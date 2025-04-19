import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAllocation = () => {
  const [rfidId, setRfidId] = useState("");
  const [studentNameInput, setStudentNameInput] = useState("");
  const [dormitoryId, setDormitoryId] = useState("");
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/dormitories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDormitories(res.data);
      } catch (error) {
        console.error("Error fetching dormitories:", error);
      }
    };

    fetchDormitories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Step 1: Fetch student using RFID
      const response = await axios.get(
        `http://localhost:8000/api/students/?rfid_tag__rfid_tag_id=${rfidId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const students = response.data;
      if (students.length === 0) {
        setMessage("No student found with this RFID tag.");
        return;
      }

      const student = students[0];

      // Step 2: Check if name matches
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase();
      if (fullName !== studentNameInput.trim().toLowerCase()) {
        setMessage("RFID tag and name do not match.");
        return;
      }

      // Step 3: Fetch dormitory object by dormitoryId
      const dormResponse = await axios.get(
        `http://localhost:8000/api/dormitories/${dormitoryId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dormitory = dormResponse.data;

      // Step 4: Create DormitoryAssignment with full student and dormitory objects

      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      await axios.post(
        "http://localhost:8000/api/dormitory-assignments/",
        {
          student: student.student_id, // Send only the student's ID
          dormitory: dormitory.dormitory_id, // Send only the dormitory's ID
          assignment_date: currentDate, // Include the assignment date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Dormitory assignment successful!");
      setRfidId("");
      setStudentNameInput("");
      setDormitoryId("");
    } catch (error) {
      console.error("Assignment failed:", error);
      setMessage("Error assigning dormitory.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 font-Montserrat p-4">
      <h2 className="text-2xl font-bold mb-6">Assign Dormitory to Student</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-6 rounded-2xl"
      >
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Student Name
          </label>
          <input
            type="text"
            value={studentNameInput}
            onChange={(e) => setStudentNameInput(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., John Doe"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            RFID Tag ID
          </label>
          <input
            type="text"
            value={rfidId}
            onChange={(e) => setRfidId(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., 123456"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Select Dormitory
          </label>
          <select
            value={dormitoryId}
            onChange={(e) => setDormitoryId(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">-- Choose Dormitory --</option>
            {dormitories.map((dorm) => (
              <option key={dorm.dormitory_id} value={dorm.dormitory_id}>
                {dorm.dormitory_name} - Room {dorm.room_number}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded mt-2"
        >
          Assign Dorm
        </button>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default StudentAllocation;
