import React, { useState, useEffect } from "react";
import axios from "axios";

const DormitoryAssignmentTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [dormitoriesMap, setDormitoriesMap] = useState({});
  const [dormitories, setDormitories] = useState([]);
  const [selectedDormitory, setSelectedDormitory] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [assignmentsRes, dormitoriesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/dormitory-assignments/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/dormitories/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const dormitoriesList = dormitoriesRes.data;
        setDormitories(dormitoriesList);

        // Create a map of dormitory_id to dormitory object
        const dormMap = {};
        dormitoriesList.forEach((d) => {
          dormMap[d.dormitory_id] = d;
        });
        setDormitoriesMap(dormMap);

        const fetchedAssignments = assignmentsRes.data;

        // Fetch all student data in parallel
        const studentIds = [
          ...new Set(fetchedAssignments.map((a) => a.student)),
        ];
        const studentPromises = studentIds.map((id) =>
          axios.get(`http://localhost:8000/api/students/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );
        const studentResponses = await Promise.all(studentPromises);
        const studentMap = {};
        studentResponses.forEach((res) => {
          studentMap[res.data.student_id] = res.data;
        });
        setStudentsMap(studentMap);

        setAssignments(fetchedAssignments);
        setFilteredAssignments(fetchedAssignments);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, [token]);

  useEffect(() => {
    let filtered = assignments;

    if (selectedDormitory) {
      filtered = filtered.filter(
        (a) => dormitoriesMap[a.dormitory]?.dormitory_name === selectedDormitory
      );
    }

    if (selectedRoom) {
      filtered = filtered.filter(
        (a) => dormitoriesMap[a.dormitory]?.room_number === selectedRoom
      );
    }

    setFilteredAssignments(filtered);
  }, [selectedDormitory, selectedRoom, assignments, dormitoriesMap]);

  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/dormitory-assignments/${assignmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedAssignments = assignments.filter(
        (a) => a.assignment_id !== assignmentId
      );
      setAssignments(updatedAssignments);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  const uniqueDormitoryNames = [
    ...new Set(dormitories.map((d) => d.dormitory_name)),
  ];
  const uniqueRoomNumbers = [
    ...new Set(
      dormitories
        .filter(
          (d) => !selectedDormitory || d.dormitory_name === selectedDormitory
        )
        .map((d) => d.room_number)
    ),
  ];

  return (
    <div className="w-full mx-auto mt-8 font-Montserrat p-4">
      <h2 className="text-2xl font-bold mb-6">Dormitory Assignments</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={selectedDormitory}
          onChange={(e) => setSelectedDormitory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Dormitories</option>
          {uniqueDormitoryNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Rooms</option>
          {uniqueRoomNumbers.map((room) => (
            <option key={room} value={room}>
              Room {room}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse bg-white overflow-x-auto">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b-2 font-bold text-md">
              Student Name
            </th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">
              Dormitory
            </th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">
              Room Number
            </th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">
              Assignment Date
            </th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((assignment) => {
            const student = studentsMap[assignment.student];
            const dorm = dormitoriesMap[assignment.dormitory];
            return (
              <tr
                key={assignment.assignment_id}
                className="text-center hover:bg-gray-50"
              >
                <td className="py-3 px-4 border-b">
                  {student
                    ? `${student.first_name} ${student.last_name}`
                    : "Loading..."}
                </td>
                <td className="py-3 px-4 border-b">
                  {dorm ? dorm.dormitory_name : "Loading..."}
                </td>
                <td className="py-3 px-4 border-b">
                  {dorm ? dorm.room_number : "Loading..."}
                </td>
                <td className="py-3 px-4 border-b">
                  {assignment.assignment_date}
                </td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleDelete(assignment.assignment_id)}
                    className="block py-2 px-4 border-b-2 text-md shadow-md text-xs font-semibold text-center capitalize bg-radishred text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DormitoryAssignmentTable;
