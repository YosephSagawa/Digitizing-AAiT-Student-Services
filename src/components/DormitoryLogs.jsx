import React from "react";
import StudentData from "../stores/StudentData";

const DormitoryLogs = () => {
  const SpecificStudent = StudentData.Students.find(
    (student) => student.id === 1
  );

  return (
    <div className="font-Montserrat p-4 overflow-x-auto">
      <h1 className="ml-2 sm:text-2xl text-xl text-[#252C58] my-10">
        Dormitory logs
      </h1>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-white text-left border-t">
            <th className="py-3 px-4 border-b-2 font-bold text-md">Log Time</th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">
              Dorm Room
            </th>
            <th className="py-3 px-4 border-b-2 font-bold text-md">
              Access Count
            </th>
          </tr>
        </thead>
        <tbody>
          {SpecificStudent ? (
            SpecificStudent.dormitoryAccessLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{log.logTime}</td>
                <td className="py-3 px-4 border-b">{log.dormRoom}</td>
                <td className="py-3 px-4 border-b">{log.accessCount}</td>
              </tr>
            ))
          ) : (
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b" colSpan="3">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DormitoryLogs;
