"use client";

import React from "react";

import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY } from "@/lib/constants/theme";
import { FilterChip } from "@/components/common/filters/FilterChip";

// ===== TYPES =====

export type TargetGroupType = "staff" | "lecturers" | "students" | "referral_agents" | "courses" | "batches";

export interface RecipientSelection {
  selectedGroups: TargetGroupType[];
  
  roleSettings: {
    staff: { mode: "all" | "specific"; specificIds: string[] };
    lecturers: { mode: "all" | "specific"; specificIds: string[] };
    students: { mode: "all" | "specific"; specificIds: string[] };
    referral_agents: { mode: "all" | "specific"; specificIds: string[] };
  };

  courseSettings: {
    selectedIds: string[];
    targetRoles: { students: boolean; lecturers: boolean; staff: boolean };
  };
  batchSettings: {
    selectedIds: string[];
    targetRoles: { students: boolean; lecturers: boolean; staff: boolean };
  };
}

// ===== MOCK DATA =====

const MOCK_DATA = {
  staff: [
    { value: "s1", label: "Alice Johnson", handle: "@alice.j" },
    { value: "s2", label: "Bob Wilson", handle: "@bob.w" },
  ],
  lecturers: [
    { value: "l1", label: "Dr. Frank Lee", subLabel: "Computer Science" },
    { value: "l2", label: "Prof. Grace Park", subLabel: "Mathematics" },
  ],
  students: [
    { value: "st1", label: "Irene Kim", subLabel: "STU-001" },
    { value: "st2", label: "James Liu", subLabel: "STU-002" },
  ],
  referral_agents: [
    { value: "ra1", label: "Oscar Taylor" },
    { value: "ra2", label: "Priya Sharma" },
  ],
  courses: [
    { value: "c1", label: "React Fundamentals" },
    { value: "c2", label: "Python for Beginners" },
  ],
  batches: [
    { value: "b1", label: "Batch 01 - 2026" },
    { value: "b2", label: "Batch 02 - 2026" },
  ],
};

const GROUP_LABELS: Record<TargetGroupType, string> = {
  staff: "Staff",
  lecturers: "Lecturers",
  students: "Students",
  referral_agents: "Referral Agents",
  courses: "Courses",
  batches: "Batches",
};

// ===== PROPS =====

interface RecipientSelectorProps {
  value: RecipientSelection;
  onChange: (val: RecipientSelection) => void;
  error?: boolean;
}

// ===== COMPONENT =====

export function RecipientSelector({ value, onChange, error = false }: RecipientSelectorProps) {
  
  const handleGroupToggle = (group: TargetGroupType) => {
    let newGroups = [...value.selectedGroups];

    if (newGroups.includes(group)) {
      newGroups = newGroups.filter(g => g !== group);
    } else {
      newGroups.push(group);
    }
  
    onChange({ ...value, selectedGroups: newGroups });
  };

  const updateRoleSetting = (role: keyof typeof value.roleSettings, updates: any) => {
    onChange({
      ...value,
      roleSettings: {
        ...value.roleSettings,
        [role]: { ...value.roleSettings[role], ...updates }
      }
    });
  };

  const updateCourseSetting = (updates: any) => {
    onChange({
      ...value,
      courseSettings: { ...value.courseSettings, ...updates }
    });
  };

  const updateBatchSetting = (updates: any) => {
    onChange({
      ...value,
      batchSettings: { ...value.batchSettings, ...updates }
    });
  };

  const renderRoleBlock = (type: keyof typeof value.roleSettings) => {
    const settings = value.roleSettings[type];
    const options = MOCK_DATA[type];

    return (
      <div className="space-y-3 rounded-md border border-slate-200 p-3 bg-slate-50/50">
        <h4 className={cn(AUTH_TYPOGRAPHY.label, "text-xs font-semibold uppercase tracking-wider text-[#90A1B9]")}>{GROUP_LABELS[type]} Settings</h4>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              className="accent-[#0F172B] h-4 w-4 cursor-pointer"
              checked={settings.mode === "all"}
              onChange={() => updateRoleSetting(type, { mode: "all" })}
            />
            <span className="text-[13px] font-medium text-[#45556C] cursor-pointer">All {GROUP_LABELS[type]}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              className="accent-[#0F172B] h-4 w-4 cursor-pointer"
              checked={settings.mode === "specific"}
              onChange={() => updateRoleSetting(type, { mode: "specific" })}
            />
            <span className="text-[13px] font-medium text-[#45556C] cursor-pointer">Specific {GROUP_LABELS[type]}</span>
          </label>
        </div>

        {settings.mode === "specific" && (
          <div className="space-y-1">
            <label className={cn(AUTH_TYPOGRAPHY.description, "font-semibold uppercase text-[10px]")}>Select {GROUP_LABELS[type]}</label>
            <MultiSelect
              options={options}
              value={settings.specificIds}
              onChange={(ids) => updateRoleSetting(type, { specificIds: ids })}
              placeholder={`Search...`}
              className="h-9"
            />
          </div>
        )}
      </div>
    );
  };

  const renderContextBlock = (type: "courses" | "batches") => {
    const settings = type === "courses" ? value.courseSettings : value.batchSettings;
    const updateFn = type === "courses" ? updateCourseSetting : updateBatchSetting;
    const options = MOCK_DATA[type];

    return (
      <div className="space-y-4 rounded-md border border-slate-200 p-3 bg-slate-50/50">
        <h4 className={cn(AUTH_TYPOGRAPHY.label, "text-xs font-semibold uppercase tracking-wider text-[#90A1B9]")}>{GROUP_LABELS[type]} Settings</h4>
        <div className="space-y-1">
          <label className="text-[13px] font-medium text-[#45556C] block">Select {GROUP_LABELS[type]}</label>
          <MultiSelect
            options={options}
            value={settings.selectedIds}
            onChange={(ids) => updateFn({ selectedIds: ids })}
            placeholder={`Search...`}
            className="h-9"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-[#45556C] block">Target Roles within {GROUP_LABELS[type]}</label>
          <div className="flex flex-wrap gap-4">
            {(["students", "lecturers", "staff"] as const).map(role => (
              <label key={role} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={settings.targetRoles[role]}
                  onChange={(e) => updateFn({ 
                    targetRoles: { ...settings.targetRoles, [role]: e.target.checked } 
                  })}
                  className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                />
                <span className="text-[13px] font-medium text-[#45556C] cursor-pointer capitalize">{role}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-5", error && "rounded-md ring-1 ring-red-500 p-1")}>
      {/* Top Level Chip Selection */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(GROUP_LABELS) as TargetGroupType[]).map((group) => (
          <FilterChip
            key={group}
            label={GROUP_LABELS[group]}
            selected={value.selectedGroups.includes(group)}
            onClick={() => handleGroupToggle(group)}
          />
        ))}
      </div>

      {/* Settings Blocks for Selected Groups */}
      <div className="space-y-4">
        {value.selectedGroups.map((group) => (
          <div key={`${group}-settings`} className="animate-in fade-in slide-in-from-top-1 duration-200">
            {["staff", "lecturers", "students", "referral_agents"].includes(group) && renderRoleBlock(group as keyof typeof value.roleSettings)}
            {["courses", "batches"].includes(group) && renderContextBlock(group as "courses" | "batches")}
          </div>
        ))}
      </div>
    </div>
  );
}
