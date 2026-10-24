"use client";

import React, { useState, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  PhoneCall,
  GraduationCap,
  Users,
  Plus,
  Trash2,
  Loader2,
  MapPin,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  MOCK_DEPARTMENTS,
  MOCK_POSITIONS,
  MOCK_SUPERVISORS,
} from "@/data/userManagementData";
import { employeeRegisterSchema, EmployeeRegisterFormValues } from "../../../types/schemas/employeeSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ─── Field wrapper ─────────────────────────────────────────────────── */
function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  title,
  step,
  action,
}: {
  icon: React.ElementType;
  title: string;
  step: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">
            Step {step}
          </p>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {title}
          </h2>
        </div>
      </div>
      {action}
    </div>
  );
}

/* ─── Card wrapper ────────────────────────────────────────────────────── */
function FormCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Inline input style ─────────────────────────────────────────────── */
const inputCls =
  "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:bg-slate-800";

const subInputCls =
  "h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:bg-slate-800";

/* ═══════════════════════════════════════════════════════════════════════ */

export function EmployeeRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Combo box search states
  const [deptSearch, setDeptSearch] = useState("");
  const [posSearch, setPosSearch] = useState("");
  const [supSearch, setSupSearch] = useState("");

  // Filtered options
  const filteredDepts = useMemo(
    () => MOCK_DEPARTMENTS.filter((d) => d.label.toLowerCase().includes(deptSearch.toLowerCase())),
    [deptSearch]
  );
  const filteredPositions = useMemo(
    () => MOCK_POSITIONS.filter((p) => p.label.toLowerCase().includes(posSearch.toLowerCase())),
    [posSearch]
  );
  const filteredSups = useMemo(
    () => MOCK_SUPERVISORS.filter((s) => s.label.toLowerCase().includes(supSearch.toLowerCase())),
    [supSearch]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeRegisterFormValues>({
    resolver: zodResolver(employeeRegisterSchema),
    defaultValues: {
      role: "employee",
      country: "Sri Lanka",
      emergency_contacts: [{ name: "", relationship: "", mobile: "", home_tp: "", work_tp: "" }],
      qualifications: [{ qualification_title: "", institute: "", completed_year: new Date().getFullYear() }],
      dependents: [{ name: "", relationship: "", dob: "", mobile: "" }],
    },
  });

  const { fields: emergencyFields, append: appendEmergency, remove: removeEmergency } =
    useFieldArray({ control, name: "emergency_contacts" });

  const { fields: qualFields, append: appendQual, remove: removeQual } =
    useFieldArray({ control, name: "qualifications" });

  const { fields: depFields, append: appendDep, remove: removeDep } =
    useFieldArray({ control, name: "dependents" });

  const onSubmit = async (data: EmployeeRegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/employee/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to register employee");
      setSubmitted(true);
      toast.success("Employee registered successfully!");
      reset();
    } catch (error) {
      toast.error("An error occurred while registering employee.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <FormCard className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Employee Registered!</h2>
          <p className="text-sm text-slate-500 mt-1">The employee account has been created successfully.</p>
        </div>
        <Button
          size="sm"
          className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white"
          onClick={() => setSubmitted(false)}
        >
          Register Another
        </Button>
      </FormCard>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* ── SECTION 1: Personal & Employment ── */}
      <FormCard>
        <SectionHeader icon={User} title="Personal & Employment Information" step={1} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="First Name" error={errors.first_name?.message}>
            <input {...register("first_name")} className={inputCls} placeholder="Kamal" />
          </Field>
          <Field label="Last Name" error={errors.last_name?.message}>
            <input {...register("last_name")} className={inputCls} placeholder="Silva" />
          </Field>
          <Field label="EPF Number" error={errors.epf_no?.message}>
            <input {...register("epf_no")} className={inputCls} placeholder="EPF-10294" />
          </Field>
          <Field label="Date of Birth" error={errors.dob?.message}>
            <input type="date" {...register("dob")} className={inputCls} />
          </Field>
          <Field label="Join Date" error={errors.join_date?.message}>
            <input type="date" {...register("join_date")} className={inputCls} />
          </Field>
          <Field label="System Role">
            <select {...register("role")} className={inputCls}>
              <option value="employee">Employee</option>
              <option value="supervisor">Supervisor</option>
              <option value="hr">HR Manager</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
        </div>
      </FormCard>

      {/* ── SECTION 2: Organisation ── */}
      <FormCard>
        <SectionHeader icon={Briefcase} title="Organisation" step={2} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Department */}
          <Field label="Department" error={errors.department_id?.message}>
            <Controller
              control={control}
              name="department_id"
              render={({ field }) => (
                <SearchableSelect
                  options={filteredDepts}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  searchValue={deptSearch}
                  onSearchChange={setDeptSearch}
                  placeholder="Select department…"
                  searchPlaceholder="Search departments…"
                  emptyMessage="No departments found"
                  error={!!errors.department_id}
                />
              )}
            />
          </Field>

          {/* Position */}
          <Field label="Position" error={errors.position_id?.message}>
            <Controller
              control={control}
              name="position_id"
              render={({ field }) => (
                <SearchableSelect
                  options={filteredPositions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  searchValue={posSearch}
                  onSearchChange={setPosSearch}
                  placeholder="Select position…"
                  searchPlaceholder="Search positions…"
                  emptyMessage="No positions found"
                  error={!!errors.position_id}
                />
              )}
            />
          </Field>

          {/* Supervisor (Optional) */}
          <Field label="Supervisor (Optional)">
            <Controller
              control={control}
              name="supervisor_id"
              render={({ field }) => (
                <SearchableSelect
                  options={filteredSups}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  searchValue={supSearch}
                  onSearchChange={setSupSearch}
                  placeholder="Select supervisor…"
                  searchPlaceholder="Search supervisors…"
                  emptyMessage="No supervisors found"
                />
              )}
            />
          </Field>

        </div>
      </FormCard>

      {/* ── SECTION 3: Contact & Address ── */}
      <FormCard>
        <SectionHeader icon={PhoneCall} title="Contact & Address" step={3} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Work Email" error={errors.work_email?.message}>
            <input type="email" {...register("work_email")} className={inputCls} placeholder="kamal@company.com" />
          </Field>
          <Field label="Personal Email">
            <input type="email" {...register("personal_email")} className={inputCls} placeholder="kamal@gmail.com" />
          </Field>
          <Field label="Mobile Number" error={errors.mobile_no?.message}>
            <input {...register("mobile_no")} className={inputCls} placeholder="+94712345678" />
          </Field>
          <Field label="Home TP (Optional)">
            <input {...register("home_tp")} className={inputCls} placeholder="+94112223334" />
          </Field>
        </div>

        {/* Address sub-section */}
        <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Address</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Street" className="lg:col-span-2">
              <input {...register("street")} className={inputCls} placeholder="123, Main Street" />
            </Field>
            <Field label="City">
              <input {...register("city")} className={inputCls} placeholder="Colombo" />
            </Field>
            <Field label="Province">
              <input {...register("province")} className={inputCls} placeholder="Western" />
            </Field>
            <Field label="Country">
              <input {...register("country")} className={inputCls} placeholder="Sri Lanka" />
            </Field>
          </div>
        </div>
      </FormCard>

      {/* ── SECTION 4: Emergency Contacts ── */}
      <FormCard>
        <SectionHeader
          icon={Users}
          title="Emergency Contacts"
          step={4}
          action={
            <button
              type="button"
              onClick={() => appendEmergency({ name: "", relationship: "", mobile: "", home_tp: "", work_tp: "" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100 transition dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <Plus className="h-3 w-3" />
              Add Contact
            </button>
          }
        />
        <div className="space-y-3">
          {emergencyFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Name</p>
                <input {...register(`emergency_contacts.${index}.name`)} className={subInputCls} placeholder="Saman Perera" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Relationship</p>
                <input {...register(`emergency_contacts.${index}.relationship`)} className={subInputCls} placeholder="Spouse" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mobile</p>
                <input {...register(`emergency_contacts.${index}.mobile`)} className={subInputCls} placeholder="+9477…" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Home TP</p>
                <input {...register(`emergency_contacts.${index}.home_tp`)} className={subInputCls} placeholder="+9411…" />
              </div>
              <div className="flex items-end justify-end">
                {emergencyFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmergency(index)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* ── SECTION 5: Qualifications ── */}
      <FormCard>
        <SectionHeader
          icon={GraduationCap}
          title="Qualifications"
          step={5}
          action={
            <button
              type="button"
              onClick={() => appendQual({ qualification_title: "", institute: "", completed_year: new Date().getFullYear() })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100 transition dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <Plus className="h-3 w-3" />
              Add Qualification
            </button>
          }
        />
        <div className="space-y-3">
          {qualFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div className="sm:col-span-2">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Qualification Title</p>
                <input {...register(`qualifications.${index}.qualification_title`)} className={subInputCls} placeholder="BSc in Computer Science" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Institute</p>
                <input {...register(`qualifications.${index}.institute`)} className={subInputCls} placeholder="University of Colombo" />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Year</p>
                  <input type="number" {...register(`qualifications.${index}.completed_year`)} className={subInputCls} />
                </div>
                {qualFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQual(index)}
                    className="mb-0.5 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* ── SECTION 6: Dependents ── */}
      <FormCard>
        <SectionHeader
          icon={Users}
          title="Dependents"
          step={6}
          action={
            <button
              type="button"
              onClick={() => appendDep({ name: "", relationship: "", dob: "", mobile: "" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100 transition dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <Plus className="h-3 w-3" />
              Add Dependent
            </button>
          }
        />
        <div className="space-y-3">
          {depFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Name</p>
                <input {...register(`dependents.${index}.name`)} className={subInputCls} placeholder="Nimali Perera" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Relationship</p>
                <input {...register(`dependents.${index}.relationship`)} className={subInputCls} placeholder="Daughter" />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date of Birth</p>
                <input type="date" {...register(`dependents.${index}.dob`)} className={subInputCls} />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mobile</p>
                <input {...register(`dependents.${index}.mobile`)} className={subInputCls} placeholder="+9477…" />
              </div>
              <div className="flex items-end justify-end">
                {depFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDep(index)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* ── Submit Bar ── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <p className="text-xs text-slate-500">
          All fields marked as required must be completed before submitting.
        </p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => reset()}
            className="text-xs"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Registering…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Register Employee
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EmployeeRegisterForm;