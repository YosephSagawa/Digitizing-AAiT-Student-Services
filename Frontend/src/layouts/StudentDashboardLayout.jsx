import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getStudentProfile } from "../services/api";

//Components
import DashboardCard from "../components/DashboardCard";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setStudent(data.profile.student);
      } catch (error) {
        console.error("Failed to fetch student profile", error);
      }
    };

    fetchProfile();
  }, []);

  if (!student) return <p>Loading...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Request submitted:", { studentId, reason });
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar name={student.first_name} photo={student.image} />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Welcome, {student.first_name || "Student"}!
          </h1>
        </div>
        <div className="flex flex-row flex-wrap sm:grid sm:grid-cols-3 sm:gap-4">
          <DashboardCard
            title="Attendance Report"
            description="View your attendance report"
            link="/attendance/report"
            action="View Report"
          />
          <DashboardCard
            title="Cafeteria Logs"
            description="View your cafeteria Logs"
            link="/dashboard/student/cafeteria_logs"
            action="View Logs"
          />
          <DashboardCard
            title="Access Logs"
            description="View your access Logs"
            link="/dashboard/student/access_logs"
            action="View Logs"
          />
        </div>

        <main>
          <Outlet />
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
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
