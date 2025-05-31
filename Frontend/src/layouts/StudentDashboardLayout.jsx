import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getStudentProfile, generateOTP } from "../services/api";

//Components
import DashboardCard from "../components/DashboardCard";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

  const handleRequestOTP = async () => {
    try {
      const response = await generateOTP();
      setMessage("OTP sent to your email!");
      setOtpRequested(true);
      setError("");
    } catch (error) {
      setError("Failed to request OTP. Please try again.");
      setMessage("");
      console.error("OTP request error:", error);
    }
  };

  if (!student) return <p>Loading...</p>;

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
                Request OTP for Access
              </h1>
            </div>
            <div className="flex flex-col w-full sm:w-2/3 p-8 mt-4 border rounded-md mx-auto">
              {otpRequested ? (
                <p className="text-green-600 font-bold">{message}</p>
              ) : (
                <>
                  {error && <p className="text-red-600 font-bold">{error}</p>}
                  <button
                    onClick={handleRequestOTP}
                    className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    Request OTP
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
