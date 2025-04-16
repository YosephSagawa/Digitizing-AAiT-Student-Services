import React, { useState } from "react";

const RFIDIssuancePage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState(null);
  const [dormNumber, setdormNumber] = useState("");
  const handleIssueCard = () => {
    // Simulating API call
    if (cardNumber && userId) {
      setStatus("Student allocated successfully!");
      setCardNumber("");
      setUserId("");
    } else {
      setStatus("Please enter the necessary infromation.");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Dorm Student Allocation
      </h2>
      <div className="flex flex-col gap-4 min-w-6xl">
        <input
          type="text"
          placeholder="Enter Student Name"
          className="p-2 border rounded-lg"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Student ID"
          className="p-2 border rounded-lg"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Dorm Number"
          className="p-2 border rounded-lg"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded mt-2"
          onClick={handleIssueCard}
        >
          Allocate Student
        </button>
        {status && <p className="text-button font-semibold">{status}</p>}
      </div>
    </div>
  );
};

export default RFIDIssuancePage;
