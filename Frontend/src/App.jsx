import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Scanning_Page from "./pages/Scanning_Page";
import LoginPage from "./pages/LoginPage";
import StudentAttendance from "./pages/StudentAttendance";
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

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/scanning" element={<Scanning_Page />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/dashboard/student" element={<StudentDashboardLayout />}>
            <Route
              path="/dashboard/student/cafeteria_logs"
              element={<CafeteriaLogs />}
            />
            <Route
              path="/dashboard/student/access_logs"
              element={<DormitoryLogs />}
            />
          </Route>
          <Route path="dashboard/lecturer" element={<LecturerDashboard />} />
          <Route path="attendance/report" element={<StudentAttendance />} />

          <Route path="/dashboard/admin" element={<AdminDashboardLayout />}>
            <Route
              path="/dashboard/admin/manage_users"
              element={<ManageUsers />}
            />
            <Route
              path="/dashboard/admin/RFID_issuance"
              element={<RFIDIssuancePage />}
            />
            <Route
              path="/dashboard/admin/access_policy"
              element={<ManageUsers />}
            />
          </Route>
          <Route path="/dashboard/proctor" element={<ProctorDashboard />}>
            <Route
              path="/dashboard/proctor/student_allocation"
              element={<StudentAllocation />}
            />
            <Route>
              <Route
                path="/dashboard/proctor/dorm_management"
                element={<ManageDorms />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
