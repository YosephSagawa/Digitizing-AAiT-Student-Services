export const exportAttendanceToCSV = (className, date, attendance) => {
  const headers = ["Student Name", "Date", "Time In", "Status"];
  const rows = attendance.map((record) => [
    `${record.student.first_name} ${record.student.last_name}`,
    record.date,
    new Date(record.time_in).toLocaleTimeString(),
    record.status,
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((row) => row.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${className}_${date}_attendance.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
