import React, { useState } from "react";

import { Loader2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWarningModal } from "@/hooks/modals/useWarningModal";
import { cn } from "@/lib/utils";

const WarningModal = () => {
  const [loading, setLoading] = useState(false);

  const { openWarningModal, WarningData, setOpenWarningModal, setWarningData } =
    useWarningModal();

  const handleClose = () => {
    if (loading) return;

    setOpenWarningModal(false);
    setWarningData({
      title: "",
      backButtonText: "",
      function: () => {},
    });
  };

  return (
    <Dialog open={openWarningModal} onOpenChange={handleClose}>
      <DialogContent className="gap-0 p-[15px] w-[319px] max-w-full">
        <i
          className={cn(
            "danger-icon size-[50px] text-[#FDB528] mx-auto mt-10",
            WarningData.color === "red" && "text-[#FF4D49]"
          )}
        />
        <p className="text-center font-normal text-sm my-[19px] text-wrap">
          {WarningData.title}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            disabled={loading}
            variant="outline"
            className="w-full h-[39px] text-base font-semibold border-[#616161] text-[#616161] rounded-[8px]"
            onClick={() => {
              if (WarningData.cancelFunction) {
                WarningData.cancelFunction();
                handleClose();
              } else handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            className={cn(
              "w-full bg-[#FDB528] text-white h-[39px] text-base font-semibold rounded-[8px]",
              WarningData.color === "red" && "bg-[#FF4D49]"
            )}
            onClick={async () => {
              setLoading(true);
              await WarningData.function();
              setLoading(false);
              handleClose();
            }}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              WarningData.backButtonText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
