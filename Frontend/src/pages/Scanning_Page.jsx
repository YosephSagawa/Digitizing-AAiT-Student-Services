import React from "react";
import QR_Component from "../components/QR_Component";
import QR_Code from "../assets/scan_me_qr_code.jpg";

const Scanning_Page = () => {
  return (
    <div>
      <QR_Component instruction={"Scan QR Code"} QR={QR_Code} />
    </div>
  );
};

export default Scanning_Page;
