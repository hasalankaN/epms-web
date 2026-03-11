"use client";

import React from "react";

import SuccessModal from "./SuccessModal";
import WarningModal from "./WarningModal";
import FailedModal from "./FailedModal";

const Providers = () => {
  return (
    <>
      <SuccessModal />
      <WarningModal />
      <FailedModal />
    </>
  );
};

export default Providers;
