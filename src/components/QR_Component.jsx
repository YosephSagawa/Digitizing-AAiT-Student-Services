import React from "react";
import AAU_Logo from "../assets/AAU_Logo.png";

const QR_Component = ({ instruction, QR }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 min-h-screen">
      <img src={AAU_Logo} alt="AAU Logo" className="w-1/4" />
      <h1 className="text-3xl font-bold">{instruction}</h1>
      <img src={QR} alt="QR code" className="w-1/4" />
    </div>
  );
};

export default QR_Component;
