import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Request submitted:", { studentId, reason });
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Student Dashboard
          </h1>
        </div>
        <div className="flex flex-row flex-wrap sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="flex flex-col w-full justify-start p-8 mt-2 border-2 rounded-md">
            <h2 className="font-bold text-lg mb-3">Attendance Report</h2>
            <p>View your attendance report</p>
            <NavLink to="/attendance/report">
              <button className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded mt-2">
                View Report
              </button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full justify-start p-8 mt-2 border-2 rounded-md">
            <h2 className="font-bold text-lg mb-3">Cafeteria Report</h2>
            <p>View your cafeteria report</p>
            <NavLink to="/cafeteria/report">
              <button className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded mt-2">
                View Report
              </button>
            </NavLink>
          </div>
          <div className="flex flex-col w-full justify-start p-8 mt-2 border-2 rounded-md">
            <h2 className="font-bold text-lg mb-3">Dormitory Report</h2>
            <p>View your dormitory report</p>
            <NavLink to="/dormitory/report">
              <button className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded mt-2">
                View Report
              </button>
            </NavLink>
          </div>
        </div>

        <div>
          <div className="flex flex-col w-fit justify-start sm:p-8 mt-2 mx-auto">
            <h1 className="text-gray-600 text-2xl sm:text-2xl font-semibold mt-8 sm:mt-0">
              Request Lost Card Replacement
            </h1>
          </div>
          <div className="flex flex-col w-full sm:w-2/3 p-8 mt-4 border rounded-md mx-auto">
            {submitted ? (
              <p className="text-green-600 font-bold">
                Your request has been submitted successfully!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="font-bold text-lg">Student ID:</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter your student ID"
                  className="border p-2 rounded-md"
                  required
                />

                <label className="font-bold text-lg">
                  Reason for Replacement:
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the reason for the card replacement"
                  className="border p-2 rounded-md"
                  rows="4"
                  required
                ></textarea>

                <button
                  type="submit"
                  className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
