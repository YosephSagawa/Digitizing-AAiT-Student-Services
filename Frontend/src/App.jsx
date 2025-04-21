import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Scanning_Page from "./pages/Scanning_Page";
import StudentDashboardLayout from "./layouts/StudentDashboardLayout";
import LecturerDashboard from "./pages/LecturerDashboard";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import ProctorDashboard from "./pages/ProctorDashboard";
import DormitoryLogs from "./components/AccessLogs";
import CafeteriaLogs from "./components/CafeteriaLogs";
import ManageUsers from "./pages/ManageUsers";
import RFIDIssuancePage from "./pages/RFIDIssuance";
import StudentAllocation from "./pages/StudentAllocation";
import ManageDorms from "./pages/ManageDorms";
import StudentAttendance from "./pages/StudentAttendance";
import AttendanceDetails from "./pages/AttendanceDetails";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/scanning" element={<Scanning_Page />} />

        {/* Student Routes */}
        <Route element={<PrivateRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard/student" element={<StudentDashboardLayout />}>
            <Route path="cafeteria_logs" element={<CafeteriaLogs />} />
            <Route path="access_logs" element={<DormitoryLogs />} />
          </Route>
        </Route>

        {/* Lecturer Routes */}
        <Route element={<PrivateRoute allowedRoles={["instructor"]} />}>
          <Route path="/dashboard/lecturer" element={<LecturerDashboard />} />
          <Route
            path="/attendance/:className/:date"
            element={<AttendanceDetails />}
          />
        </Route>

        {/* Student Attendance (can also restrict if needed) */}
        <Route element={<PrivateRoute allowedRoles={["student"]} />}>
          <Route path="/attendance/report" element={<StudentAttendance />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard/admin" element={<AdminDashboardLayout />}>
            <Route path="manage_users" element={<ManageUsers />} />
            <Route path="RFID_issuance" element={<RFIDIssuancePage />} />
            <Route path="access_policy" element={<ManageUsers />} />
          </Route>
        </Route>

        {/* Proctor Routes */}
        <Route element={<PrivateRoute allowedRoles={["proctor"]} />}>
          <Route path="/dashboard/proctor" element={<ProctorDashboard />}>
            <Route path="student_allocation" element={<StudentAllocation />} />
            <Route path="dorm_management" element={<ManageDorms />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
