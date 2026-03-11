import { create } from "zustand";

interface FailedModalState {
  failedData: {
    title: string;
    backButtonText: string;
    function: () => void;
    cancelFunction?: () => void;
  };
  openFailedModal: boolean;
  setOpenFailedModal: (value: boolean) => void;
  setFailedData: (data: FailedModalState["failedData"]) => void;
}

export const useFailedModal = create<FailedModalState>((set) => ({
  failedData: {
    title: "",
    backButtonText: "",
    function: () => {},
  },
  openFailedModal: false,
  setOpenFailedModal: (openFailedModal) => set({ openFailedModal }),
  setFailedData: (failedData) => set({ failedData }),
}));
