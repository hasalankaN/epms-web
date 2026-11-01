"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCreateProfileUpdateRequestMutation } from "@/hooks/api/profile/useProfile";
import type { EmployeeProfile, EmergencyContact, WorkExperience, Dependent } from "@/types/dto/profile.dto";

interface RequestProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployeeProfile;
}

export function RequestProfileUpdateModal({
  isOpen,
  onClose,
  profile,
}: RequestProfileUpdateModalProps) {
  const [contactNumber, setContactNumber] = useState(profile.contactNumber);
  const [streetAddress, setStreetAddress] = useState(profile.streetAddress);
  const [city, setCity] = useState(profile.city);
  const [province, setProvince] = useState(profile.province);
  const [qualification, setQualification] = useState(profile.qualification);
  const [reason, setReason] = useState("");

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    ...profile.emergencyContacts,
  ]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    ...profile.workExperiences,
  ]);
  const [dependents, setDependents] = useState<Dependent[]>([...profile.dependents]);

  const createMutation = useCreateProfileUpdateRequestMutation();

  const handleAddEmergency = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      {
        id: `temp-${Date.now()}`,
        name: "",
        relationship: "",
        workPhone: "",
        mobilePhone: "",
      },
    ]);
  };

  const handleRemoveEmergency = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    createMutation.mutate(
      {
        contactNumber,
        streetAddress,
        city,
        province,
        qualification,
        emergencyContacts,
        workExperiences,
        dependents,
        reason,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  // Preview changes
  const hasContactChanged = contactNumber !== profile.contactNumber;
  const hasAddressChanged =
    streetAddress !== profile.streetAddress ||
    city !== profile.city ||
    province !== profile.province;
  const hasQualChanged = qualification !== profile.qualification;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Request Profile Update
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Submit modifications for HR review. Official employment attributes require Admin authorization.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Read-Only Locked Fields Banner */}
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Official Employment Details (Locked)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Employee ID:</span>{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.employeeCode}</span>
              </div>
              <div>
                <span className="text-slate-400">NIC:</span>{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.nic}</span>
              </div>
              <div>
                <span className="text-slate-400">EPF No:</span>{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.epfNo}</span>
              </div>
              <div>
                <span className="text-slate-400">Department:</span>{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-400">Position:</span>{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.positionName}</span>
              </div>
              <div>
                <span className="text-slate-400">Supervisor:</span>{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{profile.supervisorName}</span>
              </div>
            </div>
          </div>

          {/* Editable Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Personal & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Mobile Number
                </label>
                <Input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Province
                </label>
                <Input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Street Address
                </label>
                <Input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  City
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Qualifications
                </label>
                <Input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Emergency Contacts
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEmergency}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" /> Add Contact
              </Button>
            </div>
            {emergencyContacts.map((contact, idx) => (
              <div
                key={contact.id || idx}
                className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
              >
                <Input
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => {
                    const copy = [...emergencyContacts];
                    copy[idx].name = e.target.value;
                    setEmergencyContacts(copy);
                  }}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Relationship"
                  value={contact.relationship}
                  onChange={(e) => {
                    const copy = [...emergencyContacts];
                    copy[idx].relationship = e.target.value;
                    setEmergencyContacts(copy);
                  }}
                  className="h-8 text-xs w-28"
                />
                <Input
                  placeholder="Mobile Phone"
                  value={contact.mobilePhone}
                  onChange={(e) => {
                    const copy = [...emergencyContacts];
                    copy[idx].mobilePhone = e.target.value;
                    setEmergencyContacts(copy);
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEmergency(idx)}
                  className="h-8 w-8 text-rose-500 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Preview Changes */}
          {(hasContactChanged || hasAddressChanged || hasQualChanged) && (
            <div className="rounded-lg border border-pink-200 dark:border-pink-900/50 bg-pink-50/50 dark:bg-pink-950/20 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-pink-700 dark:text-pink-300">
                Preview Changes To Be Submitted:
              </p>
              {hasContactChanged && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Phone:</span>
                  <span className="line-through text-slate-400">{profile.contactNumber}</span>
                  <ArrowRight className="h-3 w-3 text-pink-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">{contactNumber}</span>
                </div>
              )}
              {hasAddressChanged && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Address:</span>
                  <span className="line-through text-slate-400">{profile.streetAddress}, {profile.city}</span>
                  <ArrowRight className="h-3 w-3 text-pink-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">{streetAddress}, {city}</span>
                </div>
              )}
              {hasQualChanged && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Qualifications:</span>
                  <span className="line-through text-slate-400">{profile.qualification}</span>
                  <ArrowRight className="h-3 w-3 text-pink-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">{qualification}</span>
                </div>
              )}
            </div>
          )}

          {/* Reason mandatory field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Reason for Request <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400">{reason.length}/300 chars</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 300))}
              placeholder="Explain the background for these changes (e.g. relocated house, renewed qualifications)..."
              rows={3}
              required
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#d0006a] text-white"
              disabled={createMutation.isPending || !reason.trim()}
            >
              {createMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

