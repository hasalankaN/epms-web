import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type CourseGeneralDetailsValues,
  type CourseFeeDetailsValues,
  type CourseCommissionDetailsValues,
  defaultCourseGeneralDetailsValues,
  defaultCourseFeeDetailsValues,
  defaultCourseCommissionDetailsValues,
} from "@/schemas/course.schema";

interface CourseFormState {
  mode: "add" | "edit";
  editCourseId: string | null;

  generalDetails: Partial<CourseGeneralDetailsValues>;
  feeDetails: Partial<CourseFeeDetailsValues>;
  commissionDetails: Partial<CourseCommissionDetailsValues>;

  setMode: (mode: "add" | "edit", courseId?: string) => void;
  setGeneralDetails: (data: Partial<CourseGeneralDetailsValues>) => void;
  setFeeDetails: (data: Partial<CourseFeeDetailsValues>) => void;
  setCommissionDetails: (data: Partial<CourseCommissionDetailsValues>) => void;

  // Load all form data at once (for edit mode)
  loadFormData: (data: {
    generalDetails: Partial<CourseGeneralDetailsValues>;
    feeDetails: Partial<CourseFeeDetailsValues>;
    commissionDetails: Partial<CourseCommissionDetailsValues>;
  }) => void;

  updateGeneralField: <K extends keyof CourseGeneralDetailsValues>(
    field: K,
    value: CourseGeneralDetailsValues[K]
  ) => void;
  updateFeeField: <K extends keyof CourseFeeDetailsValues>(
    field: K,
    value: CourseFeeDetailsValues[K]
  ) => void;
  updateCommissionField: <K extends keyof CourseCommissionDetailsValues>(
    field: K,
    value: CourseCommissionDetailsValues[K]
  ) => void;

  resetForm: () => void;
  resetStep: (step: 1 | 2 | 3) => void;
}

const initialState = {
  mode: "add" as const,
  editCourseId: null as string | null,
  generalDetails: defaultCourseGeneralDetailsValues as Partial<CourseGeneralDetailsValues>,
  feeDetails: defaultCourseFeeDetailsValues as Partial<CourseFeeDetailsValues>,
  commissionDetails: defaultCourseCommissionDetailsValues as Partial<CourseCommissionDetailsValues>,
};

export const useCourseFormStore = create<CourseFormState>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode, courseId) =>
        set({
          mode,
          editCourseId: courseId || null,
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
              return { ...state, generalDetails: defaultCourseGeneralDetailsValues };
            case 2:
              return { ...state, feeDetails: defaultCourseFeeDetailsValues };
            case 3:
              return { ...state, commissionDetails: defaultCourseCommissionDetailsValues };
            default:
              return state;
          }
        }),
    }),
    {
      name: "course-form-storage", // localStorage key
      partialize: (state) => ({
        mode: state.mode,
        editCourseId: state.editCourseId,
        generalDetails: state.generalDetails,
        feeDetails: state.feeDetails,
        commissionDetails: state.commissionDetails,
      }),
    }
  )
);
