import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type GeneralDetailsValues,
  type FeeDetailsValues,
  type CommissionDetailsValues,
  defaultGeneralDetailsValues,
  defaultFeeDetailsValues,
  defaultCommissionDetailsValues,
} from "@/schemas/batch.schema";

interface BatchFormState {
  mode: "add" | "edit";
  editBatchId: string | null;

  generalDetails: Partial<GeneralDetailsValues>;
  feeDetails: Partial<FeeDetailsValues>;
  commissionDetails: Partial<CommissionDetailsValues>;

  setMode: (mode: "add" | "edit", batchId?: string) => void;
  setGeneralDetails: (data: Partial<GeneralDetailsValues>) => void;
  setFeeDetails: (data: Partial<FeeDetailsValues>) => void;
  setCommissionDetails: (data: Partial<CommissionDetailsValues>) => void;

  // Load all form data at once (for edit mode)
  loadFormData: (data: {
    generalDetails: Partial<GeneralDetailsValues>;
    feeDetails: Partial<FeeDetailsValues>;
    commissionDetails: Partial<CommissionDetailsValues>;
  }) => void;

  updateGeneralField: <K extends keyof GeneralDetailsValues>(
    field: K,
    value: GeneralDetailsValues[K]
  ) => void;
  updateFeeField: <K extends keyof FeeDetailsValues>(
    field: K,
    value: FeeDetailsValues[K]
  ) => void;
  updateCommissionField: <K extends keyof CommissionDetailsValues>(
    field: K,
    value: CommissionDetailsValues[K]
  ) => void;

  resetForm: () => void;
  resetStep: (step: 1 | 2 | 3) => void;
}

const initialState = {
  mode: "add" as const,
  editBatchId: null as string | null,
  generalDetails: defaultGeneralDetailsValues as Partial<GeneralDetailsValues>,
  feeDetails: defaultFeeDetailsValues as Partial<FeeDetailsValues>,
  commissionDetails: defaultCommissionDetailsValues as Partial<CommissionDetailsValues>,
};

export const useBatchFormStore = create<BatchFormState>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode, batchId) =>
        set({
          mode,
          editBatchId: batchId || null,
        }),

      loadFormData: (data) =>
        set({
          generalDetails: data.generalDetails,
          feeDetails: data.feeDetails,
          commissionDetails: data.commissionDetails,
        }),

      setGeneralDetails: (data) =>
        set((state) => ({
          generalDetails: { ...state.generalDetails, ...data },
        })),

      setFeeDetails: (data) =>
        set((state) => ({
          feeDetails: { ...state.feeDetails, ...data },
        })),

      setCommissionDetails: (data) =>
        set((state) => ({
          commissionDetails: { ...state.commissionDetails, ...data },
        })),

      updateGeneralField: (field, value) =>
        set((state) => ({
          generalDetails: { ...state.generalDetails, [field]: value },
        })),

      updateFeeField: (field, value) =>
        set((state) => ({
          feeDetails: { ...state.feeDetails, [field]: value },
        })),

      updateCommissionField: (field, value) =>
        set((state) => ({
          commissionDetails: { ...state.commissionDetails, [field]: value },
        })),

      resetForm: () => set(initialState),

      resetStep: (step) =>
        set((state) => {
          switch (step) {
            case 1:
              return { ...state, generalDetails: defaultGeneralDetailsValues };
            case 2:
              return { ...state, feeDetails: defaultFeeDetailsValues };
            case 3:
              return { ...state, commissionDetails: defaultCommissionDetailsValues };
            default:
              return state;
          }
        }),
    }),
    {
      name: "batch-form-storage", // localStorage key
      partialize: (state) => ({
        mode: state.mode,
        editBatchId: state.editBatchId,
        generalDetails: state.generalDetails,
        feeDetails: state.feeDetails,
        commissionDetails: state.commissionDetails,
      }),
    }
  )
);
