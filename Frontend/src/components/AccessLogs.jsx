import React, { useEffect, useState } from "react";
import axios from "axios";

const DormitoryLogs = () => {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const profileRes = await axios.get(
          "http://localhost:8000/api/auth/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const studentRFID =
          profileRes.data.profile.student.rfid_tag.rfid_tag_id;

        const logsRes = await axios.get(
          `http://localhost:8000/api/access-control/?rfid_tag__rfid_tag_id=${studentRFID}&location=dormitory`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLogs(logsRes.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="font-Montserrat p-4 overflow-x-auto">
      <h1 className="ml-2 sm:text-2xl text-xl text-[#252C58] my-10">
        Access Logs
      </h1>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-white text-left border-t">
            <th className="py-3 px-4 border-b-2 font-bold text-md">Log Time</th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">Location</th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.length ? (
            logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  {new Date(log.access_time).toLocaleString()}
                </td>
                <td className="py-3 px-4 border-b">
                  {log.location.charAt(0).toUpperCase() +
                    log.location.slice(1).toLowerCase()}
                </td>
                <td className="py-3 px-4 border-b">
                  {log.status.charAt(0).toUpperCase() +
                    log.status.slice(1).toLowerCase()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-3 px-4 text-center">
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DormitoryLogs;
