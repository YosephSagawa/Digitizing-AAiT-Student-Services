import React, { useState } from "react";

const RFIDIssuancePage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState(null);

  const handleIssueCard = () => {
    // Simulating API call
    if (cardNumber && userId) {
      setStatus("RFID card issued successfully!");
      setCardNumber("");
      setUserId("");
    } else {
      setStatus("Please enter both card number and user ID.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">RFID Card Issuance</h2>
      <div className="flex flex-col gap-4 max-w-lg">
        <input
          type="text"
          placeholder="Enter RFID Card Number"
          className="p-2 border rounded-lg"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter User ID"
          className="p-2 border rounded-lg"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          onClick={handleIssueCard}
        >
          Issue RFID Card
        </button>
        {status && <p className="text-button font-semibold">{status}</p>}
      </div>
    </div>
  );
};

export default RFIDIssuancePage;
