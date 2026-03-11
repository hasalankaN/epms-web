import React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFailedModal } from "@/hooks/modals/useFailedModal";

const FailedModal = () => {
  const { openFailedModal, failedData, setOpenFailedModal, setFailedData } =
    useFailedModal();

  const handleClose = () => {
    setOpenFailedModal(false);
    setFailedData({
      title: "",
      backButtonText: "",
      function: () => {},
    });
  };

  return (
    <Dialog open={openFailedModal} onOpenChange={handleClose}>
      <DialogContent className="gap-0 p-5 w-[317px] max-w-full">
        <i className="danger-icon size-[50px] text-[#FF4D49] mx-auto mt-10" />
        <p className="text-center font-normal text-sm my-[19px]">
          {failedData.title}
        </p>

        <Button
          className="w-full bg-[#FF4D49] text-white h-[39px] text-base font-semibold rounded-[8px]"
          onClick={() => {
            failedData.function();
            handleClose();
          }}
        >
          {failedData.backButtonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FailedModal;
