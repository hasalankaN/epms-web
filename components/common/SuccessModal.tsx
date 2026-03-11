import React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useSuccessModal } from "@/hooks/modals/useSuccessModal";

const SuccessModal = () => {
  const { openSuccessModal, successData, setOpenSuccessModal, setSuccessData } =
    useSuccessModal();

  const handleClose = () => {
    setOpenSuccessModal(false);
    setSuccessData({
      title: "",
      backButtonText: "",
      function: () => {},
    });
  };

  return (
    <Dialog open={openSuccessModal} onOpenChange={handleClose}>
      <DialogContent className="gap-0 p-5 w-[319px] max-w-full">
        <i className="success-icon size-[55px] text-[#4CAF50] mx-auto mt-10" />
        <p className="text-center text-[#757575] font-medium text-sm mt-[19px] text-wrap">
          {successData.title}
        </p>
        {successData.description && (
          <p className="text-center text-gray/70 text-sm mb-[19px] text-wrap">
            {successData.description}
          </p>
        )}
        <Button
          className="w-full bg-[#4CAF50] text-white h-[39px] text-base font-semibold rounded-[8px] mt-2.5"
          onClick={() => {
            successData.function();
            handleClose();
          }}
        >
          {successData.backButtonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
