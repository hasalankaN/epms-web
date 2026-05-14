"use client";

import React, { useState, useEffect, useMemo } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import ImageUpload from "@/components/common/ImageUpload";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { useDebounce } from "@/hooks/useDebounce";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AddTaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

const FieldLabel = ({
  children,
  required = false,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

export function AddTaskPanel({ isOpen, onClose }: AddTaskPanelProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [assignType, setAssignType] = useState<"Staff" | "Batch">("Staff");
  const [materialImage, setMaterialImage] = useState("");

  // Search and selection states
  const [staffSearch, setStaffSearch] = useState("");
  const [batchSearch, setBatchSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const debouncedStaffSearch = useDebounce(staffSearch);
  const debouncedBatchSearch = useDebounce(batchSearch);

  // Fetch real data
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaff({
    search: debouncedStaffSearch,
    size: 20,
  });

  const { data: batchesData, isLoading: isLoadingBatches } = useGetBatches({
    search: debouncedBatchSearch,
    size: 20,
  });

  const staffOptions = useMemo(() => {
    return (staffData?.results || []).map((s) => ({
      value: s.userId,
      label: `${s.firstName} ${s.lastName}`,
      subLabel: s.email,
    }));
  }, [staffData]);

  const batchOptions = useMemo(() => {
    return (batchesData?.results || []).map((b) => ({
      value: b.id,
      label: b.name,
      subLabel: b.category,
    }));
  }, [batchesData]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
      setShowDiscardModal(false);
      setDueDate(undefined);
      setAssignType("Staff");
      setMaterialImage("");
      setSelectedStaff("");
      setSelectedBatch("");
      setStaffSearch("");
      setBatchSearch("");
    }
  }, [isOpen]);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleInputChange = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleCreate = () => {
    toast.success("Task created successfully");
    onClose();
  };

  return (
    <>
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseAttempt}
                className="fixed inset-0 z-[99999] bg-black/20 backdrop-blur-sm"
              />

              {/* Side Panel */}
              <motion.div
                key="panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[500px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow:
                    "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                  <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">
                    Add Task
                  </h2>
                  <button
                    title="close"
                    onClick={handleCloseAttempt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4 text-[#64748B]" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                  <div className="flex flex-col gap-6">

                    {/* Task Name */}
                    <div className="space-y-1">
                      <FieldLabel required>Task Name</FieldLabel>
                      <Input
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                        placeholder="lorem ipsum"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">
                      <FieldLabel required>Due Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50">
                            <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                              <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                            </div>
                            <input
                              value={dueDate ? format(dueDate, "dd/MM/yyyy") : ""}
                              readOnly
                              placeholder="Pick a date"
                              className={cn(
                                "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none"
                              )}
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[99999999]" align="start">
                          <DateRangeCalendar
                            mode="single"
                            startDate={dueDate || null}
                            endDate={null}
                            onDateChange={(start) => {
                              setDueDate(start || undefined);
                              handleInputChange();
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Task Description */}
                    <div className="space-y-1">
                      <FieldLabel required>Task Description</FieldLabel>
                      <Textarea
                        className={cn("min-h-[100px] resize-none", AUTH_INPUT.placeholder)}
                        placeholder="eg: Type your notes here"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Assign to — Radio Group */}
                    <div className="space-y-3">
                      <FieldLabel required>Assign to</FieldLabel>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="assign-staff"
                            name="assign-type"
                            value="Staff"
                            checked={assignType === "Staff"}
                            onChange={() => {
                              setAssignType("Staff");
                              handleInputChange();
                            }}
                            className="accent-[#0F172B] h-4 w-4 cursor-pointer"
                          />
                          <label
                            htmlFor="assign-staff"
                            className="text-sm font-medium text-[#45556C] cursor-pointer"
                          >
                            Staff
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="assign-batch"
                            name="assign-type"
                            value="Batch"
                            checked={assignType === "Batch"}
                            onChange={() => {
                              setAssignType("Batch");
                              handleInputChange();
                            }}
                            className="accent-[#0F172B] h-4 w-4 cursor-pointer"
                          />
                          <label
                            htmlFor="assign-batch"
                            className="text-sm font-medium text-[#45556C] cursor-pointer"
                          >
                            Batch
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Select Staff / Batch */}
                    <div className="space-y-1">
                      <FieldLabel required>Select {assignType === "Staff" ? "Staff" : "Batch"}</FieldLabel>
                      {assignType === "Staff" ? (
                        <SearchableSelect
                          options={staffOptions}
                          value={selectedStaff}
                          onChange={(val) => {
                            setSelectedStaff(val);
                            handleInputChange();
                          }}
                          onSearchChange={setStaffSearch}
                          searchValue={staffSearch}
                          isLoading={isLoadingStaff}
                          placeholder="Select Staff"
                          searchPlaceholder="Search staff name or email..."
                        />
                      ) : (
                        <SearchableSelect
                          options={batchOptions}
                          value={selectedBatch}
                          onChange={(val) => {
                            setSelectedBatch(val);
                            handleInputChange();
                          }}
                          onSearchChange={setBatchSearch}
                          searchValue={batchSearch}
                          isLoading={isLoadingBatches}
                          placeholder="Select Batch"
                          searchPlaceholder="Search batch name or category..."
                        />
                      )}
                    </div>

                    {/* Materials Related to Task */}
                    <div className="space-y-2">
                      <FieldLabel>Materials Related to Task</FieldLabel>
                      <div
                        style={{
                          display: "flex",
                          height: "140px",
                          padding: "10px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                          alignSelf: "stretch",
                          borderRadius: "0.375rem",
                          border: "1px dashed #E2E8F0",
                          overflow: "hidden",
                        }}
                      >
                        <ImageUpload
                          imageUrl={materialImage}
                          setImage={(url) => {
                            setMaterialImage(url);
                            handleInputChange();
                          }}
                          removeImage={() => setMaterialImage("")}
                          showSupportedFormats={true}
                          supportedFormats="Supported File format: png, jpeg, WebP"
                          className="h-full w-full"
                          dropzoneClassName="!h-full !border-none !rounded-none !bg-transparent !p-0"
                          iconClassName="w-6 h-6 mb-1 text-[#90A1B9]"
                          placeholder="Upload Image Here or drag and drop here"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                  <Button
                    onClick={handleCreate}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-[38.5px] text-sm font-semibold text-white"
                    )}
                  >
                    Create
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* Discard Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
