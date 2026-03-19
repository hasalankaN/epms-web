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
  clearEditAndRestoreAdd: () => void;
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

      clearEditAndRestoreAdd: () => {
        if (typeof window !== "undefined") {
          const str = localStorage.getItem("course-add-draft-storage");

          if (str) {
            try {
              const parsed = JSON.parse(str);

              if (parsed && parsed.state) {
                set({ ...initialState, ...parsed.state, mode: "add" });
                
                return;
              }
            } catch {
              // ignore parse errors
            }
          }
        }

        set({ ...initialState, mode: "add" });
      },
    }),
    {
      name: "course-add-draft-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          
          const str = localStorage.getItem(name);

          if (!str) return null;
          
          return JSON.parse(str);
        },
        setItem: (name, value: any) => {
          if (typeof window === "undefined") return;

          if (value?.state?.mode === "edit") return;
          
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          
          localStorage.removeItem(name);
        },
      },
    }
  )
);
