import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Scanning_Page from "./pages/Scanning_Page";
import LoginPage from "./pages/LoginPage";
import AttendancePage from "./pages/AttendancePage";
import Dashboard from "./pages/Dashboard";
import StudentAttendance from "./pages/StudentAttendance";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/scanning" element={<Scanning_Page />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route
            path="attendance/report"
            element={<StudentAttendance />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
