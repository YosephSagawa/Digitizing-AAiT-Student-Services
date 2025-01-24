const StudentData = {
  Students: [
    {
      id: 1,
      name: "John Doe",
      attendance: [
        {
          date: "Dec 11, 2024",
          checkin: "8:00 AM",
          status: "Present",
          className: "Mathematics",
        },
        {
          date: "Dec 12, 2024",
          checkin: "8:30 AM",
          status: "Late",
          className: "Physics",
        },
      ],
      cafeteriaLogs: [
        { logTime: "12:30 PM", meal: "Lunch" },
        { logTime: "8:00 AM", meal: "Breakfast" },
      ],
      dormitoryAccessLogs: [
        { dormRoom: "A101", logTime: "10:00 PM", accessCount: 3 },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      attendance: [
        {
          date: "Dec 13, 2024",
          checkin: "9:00 AM",
          status: "Late",
          className: "Biology",
        },
        {
          date: "Dec 14, 2024",
          checkin: "8:15 AM",
          status: "Present",
          className: "Chemistry",
        },
      ],
      cafeteriaLogs: [
        { logTime: "1:00 PM", meal: "Lunch" },
        { logTime: "6:30 PM", meal: "Dinner" },
      ],
      dormitoryAccessLogs: [
        { dormRoom: "B202", logTime: "11:00 PM", accessCount: 2 },
      ],
    },
    {
      id: 3,
      name: "Michael Johnson",
      attendance: [
        {
          date: "Dec 15, 2024",
          checkin: "8:45 AM",
          status: "Late",
          className: "English",
        },
        {
          date: "Dec 16, 2024",
          checkin: "00:00",
          status: "Absent",
          className: "History",
        },
      ],
      cafeteriaLogs: [
        { logTime: "7:30 AM", meal: "Breakfast" },
        { logTime: "1:15 PM", meal: "Lunch" },
      ],
      dormitoryAccessLogs: [
        { dormRoom: "C303", logTime: "9:30 PM", accessCount: 4 },
      ],
    },
    {
      id: 4,
      name: "Emily Davis",
      attendance: [
        {
          date: "Dec 17, 2024",
          checkin: "8:10 AM",
          status: "Present",
          className: "Geography",
        },
        {
          date: "Dec 18, 2024",
          checkin: "8:25 AM",
          status: "Present",
          className: "Art",
        },
      ],
      cafeteriaLogs: [
        { logTime: "12:00 PM", meal: "Lunch" },
        { logTime: "7:00 PM", meal: "Dinner" },
      ],
      dormitoryAccessLogs: [
        { dormRoom: "D404", logTime: "10:15 PM", accessCount: 2 },
      ],
    },
    {
      id: 5,
      name: "David Wilson",
      attendance: [
        {
          date: "Dec 19, 2024",
          checkin: "9:00 AM",
          status: "Late",
          className: "Computer Science",
        },
        {
          date: "Dec 20, 2024",
          checkin: "8:20 AM",
          status: "Present",
          className: "Economics",
        },
      ],
      cafeteriaLogs: [
        { logTime: "8:30 AM", meal: "Breakfast" },
        { logTime: "1:45 PM", meal: "Lunch" },
      ],
      dormitoryAccessLogs: [
        { dormRoom: "E505", logTime: "9:45 PM", accessCount: 5 },
      ],
    },
  ],
};

export default StudentData;
