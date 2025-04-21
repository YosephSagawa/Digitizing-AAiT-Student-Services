import React from "react";

const ClassCard = ({ className, date, onClick }) => {
  return (
    <div
      className="p-4 bg-white hover:bg-gray-200 border rounded shadow-md hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold">{className}</h2>
      <p className="text-sm text-gray-600">
        {new Date(date).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ClassCard;
