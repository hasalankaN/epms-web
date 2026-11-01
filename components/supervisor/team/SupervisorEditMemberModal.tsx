"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  code: string;
  position: string;
  contact: string;
  address: string;
  qualification: string;
}

interface SupervisorEditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export function SupervisorEditMemberModal({
  isOpen,
  onClose,
  member,
}: SupervisorEditMemberModalProps) {
  const [contact, setContact] = useState(member?.contact || "");
  const [address, setAddress] = useState(member?.address || "");
  const [qualification, setQualification] = useState(member?.qualification || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Updated details for ${member.name}`);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Update Team Member Details
          </DialogTitle>
          <p className="text-xs text-slate-500">
            {member.name} ({member.code}) · {member.position}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Residential Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Technical Qualifications</label>
            <Input
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-[#E60076] hover:bg-[#d0006a] text-white">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

