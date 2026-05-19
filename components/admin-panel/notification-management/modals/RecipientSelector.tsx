"use client";

import React, { useState, useEffect, useMemo } from "react";

import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY } from "@/lib/constants/theme";
import { FilterChip } from "@/components/common/filters/FilterChip";
import { useGetLookup } from "@/hooks/api/lookup/useGetLookup";

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
  initialResolvedOptions?: { group: TargetGroupType; items: any[] } | null;
}

// ===== COMPONENT =====

export function RecipientSelector({ 
  value, 
  onChange, 
  error = false,
  initialResolvedOptions,
}: RecipientSelectorProps) {
  
  // --- SEARCH STATES ---
  const [staffSearch, setStaffSearch] = useState("");
  const [lecturersSearch, setLecturersSearch] = useState("");
  const [studentsSearch, setStudentsSearch] = useState("");
  const [referralAgentsSearch, setReferralAgentsSearch] = useState("");
  const [coursesSearch, setCoursesSearch] = useState("");
  const [batchesSearch, setBatchesSearch] = useState("");

  // --- QUERY HOOKS ---
  const { data: staffLookup, isLoading: staffLoading } = useGetLookup(
    { type: "STAFF", search: staffSearch, limit: 50 },
    value.selectedGroups.includes("staff")
  );

  const { data: lecturersLookup, isLoading: lecturersLoading } = useGetLookup(
    { type: "LECTURER", search: lecturersSearch, limit: 50 },
    value.selectedGroups.includes("lecturers")
  );

  const { data: studentsLookup, isLoading: studentsLoading } = useGetLookup(
    { type: "STUDENT", search: studentsSearch, limit: 50 },
    value.selectedGroups.includes("students")
  );

  const { data: referralAgentsLookup, isLoading: referralAgentsLoading } = useGetLookup(
    { type: "REFERRAL_AGENT", search: referralAgentsSearch, limit: 50 },
    value.selectedGroups.includes("referral_agents")
  );

  const { data: coursesLookup, isLoading: coursesLoading } = useGetLookup(
    { type: "COURSE", search: coursesSearch, limit: 50 },
    value.selectedGroups.includes("courses")
  );

  const { data: batchesLookup, isLoading: batchesLoading } = useGetLookup(
    { type: "BATCH", search: batchesSearch, limit: 50 },
    value.selectedGroups.includes("batches")
  );

  // --- ACCUMULATED OPTIONS TO PRESERVE LABELS FOR CHIPS ---
  const [accumulatedOptions, setAccumulatedOptions] = useState<Record<TargetGroupType, any[]>>({
    staff: [],
    lecturers: [],
    students: [],
    referral_agents: [],
    courses: [],
    batches: [],
  });

  useEffect(() => {
    if (staffLookup?.results) {
      setAccumulatedOptions(prev => {
        const existing = new Set(prev.staff.map(o => o.value));
        const added = staffLookup.results.filter(o => !existing.has(o.value));

        return added.length ? { ...prev, staff: [...prev.staff, ...added] } : prev;
      });
    }
  }, [staffLookup]);

  useEffect(() => {
    if (lecturersLookup?.results) {
      setAccumulatedOptions(prev => {
        const existing = new Set(prev.lecturers.map(o => o.value));
        const added = lecturersLookup.results.filter(o => !existing.has(o.value));

        return added.length ? { ...prev, lecturers: [...prev.lecturers, ...added] } : prev;
      });
    }
  }, [lecturersLookup]);

  useEffect(() => {
    if (studentsLookup?.results) {
      setAccumulatedOptions(prev => {
        const existing = new Set(prev.students.map(o => o.value));
        const added = studentsLookup.results.filter(o => !existing.has(o.value));

        return added.length ? { ...prev, students: [...prev.students, ...added] } : prev;
      });
    }
  }, [studentsLookup]);

  useEffect(() => {
    if (referralAgentsLookup?.results) {
      setAccumulatedOptions(prev => {
        const existing = new Set(prev.referral_agents.map(o => o.value));
        const added = referralAgentsLookup.results.filter(o => !existing.has(o.value));

        return added.length ? { ...prev, referral_agents: [...prev.referral_agents, ...added] } : prev;
      });
    }
  }, [referralAgentsLookup]);

  useEffect(() => {
    if (coursesLookup?.results) {
      setAccumulatedOptions(prev => {
        const existing = new Set(prev.courses.map(o => o.value));
        const added = coursesLookup.results.filter(o => !existing.has(o.value));

        return added.length ? { ...prev, courses: [...prev.courses, ...added] } : prev;
      });
    }
  }, [coursesLookup]);

  useEffect(() => {
    if (batchesLookup?.results) {
      setAccumulatedOptions(prev => {
        const existing = new Set(prev.batches.map(o => o.value));
        const added = batchesLookup.results.filter(o => !existing.has(o.value));

        return added.length ? { ...prev, batches: [...prev.batches, ...added] } : prev;
      });
    }
  }, [batchesLookup]);

  useEffect(() => {
    if (initialResolvedOptions?.items && initialResolvedOptions.items.length > 0) {
      const { group, items } = initialResolvedOptions;

      setAccumulatedOptions(prev => {
        const existing = new Set(prev[group].map(o => o.value));
        const added = items.filter(o => !existing.has(o.value));
        
        return added.length ? { ...prev, [group]: [...prev[group], ...added] } : prev;
      });
    }
  }, [initialResolvedOptions]);

  // --- COMBINED OPTIONS FOR MULTISELECTS ---
  const staffOptions = useMemo(() => {
    const currentResults = staffLookup?.results || [];
    const selectedItems = accumulatedOptions.staff.filter(opt => value.roleSettings.staff.specificIds.includes(opt.value));
    const seen = new Set(currentResults.map(o => o.value));
    const combined = [...currentResults];

    for (const item of selectedItems) {
      if (!seen.has(item.value)) {
        combined.push(item);
        seen.add(item.value);
      }
    }

    return combined;
  }, [staffLookup?.results, accumulatedOptions.staff, value.roleSettings.staff.specificIds]);

  const lecturersOptions = useMemo(() => {
    const currentResults = lecturersLookup?.results || [];
    const selectedItems = accumulatedOptions.lecturers.filter(opt => value.roleSettings.lecturers.specificIds.includes(opt.value));
    const seen = new Set(currentResults.map(o => o.value));
    const combined = [...currentResults];

    for (const item of selectedItems) {
      if (!seen.has(item.value)) {
        combined.push(item);
        seen.add(item.value);
      }
    }

    return combined;
  }, [lecturersLookup?.results, accumulatedOptions.lecturers, value.roleSettings.lecturers.specificIds]);

  const studentsOptions = useMemo(() => {
    const currentResults = studentsLookup?.results || [];
    const selectedItems = accumulatedOptions.students.filter(opt => value.roleSettings.students.specificIds.includes(opt.value));
    const seen = new Set(currentResults.map(o => o.value));
    const combined = [...currentResults];

    for (const item of selectedItems) {
      if (!seen.has(item.value)) {
        combined.push(item);
        seen.add(item.value);
      }
    }

    return combined;
  }, [studentsLookup?.results, accumulatedOptions.students, value.roleSettings.students.specificIds]);

  const referralAgentsOptions = useMemo(() => {
    const currentResults = referralAgentsLookup?.results || [];
    const selectedItems = accumulatedOptions.referral_agents.filter(opt => value.roleSettings.referral_agents.specificIds.includes(opt.value));
    const seen = new Set(currentResults.map(o => o.value));
    const combined = [...currentResults];

    for (const item of selectedItems) {
      if (!seen.has(item.value)) {
        combined.push(item);
        seen.add(item.value);
      }
    }

    return combined;
  }, [referralAgentsLookup?.results, accumulatedOptions.referral_agents, value.roleSettings.referral_agents.specificIds]);

  const coursesOptions = useMemo(() => {
    const currentResults = coursesLookup?.results || [];
    const selectedItems = accumulatedOptions.courses.filter(opt => value.courseSettings.selectedIds.includes(opt.value));
    const seen = new Set(currentResults.map(o => o.value));
    const combined = [...currentResults];

    for (const item of selectedItems) {
      if (!seen.has(item.value)) {
        combined.push(item);
        seen.add(item.value);
      }
    }

    return combined;
  }, [coursesLookup?.results, accumulatedOptions.courses, value.courseSettings.selectedIds]);

  const batchesOptions = useMemo(() => {
    const currentResults = batchesLookup?.results || [];
    const selectedItems = accumulatedOptions.batches.filter(opt => value.batchSettings.selectedIds.includes(opt.value));
    const seen = new Set(currentResults.map(o => o.value));
    const combined = [...currentResults];

    for (const item of selectedItems) {
      if (!seen.has(item.value)) {
        combined.push(item);
        seen.add(item.value);
      }
    }
    
    return combined;
  }, [batchesLookup?.results, accumulatedOptions.batches, value.batchSettings.selectedIds]);

  const groupLookupMap = {
    staff: {
      options: staffOptions,
      isLoading: staffLoading,
      search: staffSearch,
      setSearch: setStaffSearch,
    },
    lecturers: {
      options: lecturersOptions,
      isLoading: lecturersLoading,
      search: lecturersSearch,
      setSearch: setLecturersSearch,
    },
    students: {
      options: studentsOptions,
      isLoading: studentsLoading,
      search: studentsSearch,
      setSearch: setStudentsSearch,
    },
    referral_agents: {
      options: referralAgentsOptions,
      isLoading: referralAgentsLoading,
      search: referralAgentsSearch,
      setSearch: setReferralAgentsSearch,
    },
    courses: {
      options: coursesOptions,
      isLoading: coursesLoading,
      search: coursesSearch,
      setSearch: setCoursesSearch,
    },
    batches: {
      options: batchesOptions,
      isLoading: batchesLoading,
      search: batchesSearch,
      setSearch: setBatchesSearch,
    },
  };

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
    const { options, isLoading, search, setSearch } = groupLookupMap[type];

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
              onSearchChange={setSearch}
              searchValue={search}
              isLoading={isLoading}
              placeholder={`Search...`}
              className="min-h-9 h-auto py-1"
            />
          </div>
        )}
      </div>
    );
  };

  const renderContextBlock = (type: "courses" | "batches") => {
    const settings = type === "courses" ? value.courseSettings : value.batchSettings;
    const updateFn = type === "courses" ? updateCourseSetting : updateBatchSetting;
    const { options, isLoading, search, setSearch } = groupLookupMap[type];

    return (
      <div className="space-y-4 rounded-md border border-slate-200 p-3 bg-slate-50/50">
        <h4 className={cn(AUTH_TYPOGRAPHY.label, "text-xs font-semibold uppercase tracking-wider text-[#90A1B9]")}>{GROUP_LABELS[type]} Settings</h4>
        <div className="space-y-1">
          <label className="text-[13px] font-medium text-[#45556C] block">Select {GROUP_LABELS[type]}</label>
          <MultiSelect
            options={options}
            value={settings.selectedIds}
            onChange={(ids) => updateFn({ selectedIds: ids })}
            onSearchChange={setSearch}
            searchValue={search}
            isLoading={isLoading}
            placeholder={`Search...`}
            className="min-h-9 h-auto py-1"
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
