"use client";

import React, { useState } from "react";
import { User, Lock, Bell, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function SupervisorSettingsView() {
  // Personal Info
  const [fullName, setFullName] = useState("Kanishka Bandara");
  const [email] = useState("kanishka.bandara@epms.lk");
  const [phone, setPhone] = useState("+94 77 999 1234");
  const [department] = useState("Technology & Engineering");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [emailOnLeave, setEmailOnLeave] = useState(true);
  const [emailOnAdjustment, setEmailOnAdjustment] = useState(true);
  const [emailOnTaskOverdue, setEmailOnTaskOverdue] = useState(true);

  // Password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(newPassword);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Supervisor contact details updated successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (strength < 75) {
      toast.error("Password is too weak. Please include uppercase, numbers, and symbols.");
      return;
    }
    toast.success("Account password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Card 1: Personal Info */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <User className="h-5 w-5 text-[#E60076]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Supervisor Profile Information
          </h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Official Work Email</label>
            <Input value={email} disabled className="mt-1 bg-slate-50 dark:bg-slate-800 text-slate-500" />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
            <Input value={department} disabled className="mt-1 bg-slate-50 dark:bg-slate-800 text-slate-500" />
          </div>
          <div className="col-span-1 sm:col-span-2 flex justify-end pt-2">
            <Button type="submit" className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs font-semibold">
              Save Profile Updates
            </Button>
          </div>
        </form>
      </div>

      {/* Card 2: Security & Password */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Lock className="h-5 w-5 text-[#E60076]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Security & Authentication
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1"
            />
            {/* Strength meter */}
            {newPassword && (
              <div className="space-y-1 mt-1.5">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      strength <= 25
                        ? "bg-rose-500 w-1/4"
                        : strength <= 50
                        ? "bg-amber-500 w-2/4"
                        : strength <= 70
                        ? "bg-blue-500 w-3/4"
                        : "bg-emerald-500 w-full"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  Strength: {strength >= 75 ? "Strong" : strength >= 50 ? "Moderate" : "Weak"}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs font-semibold"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Card 3: Notification Preferences */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Bell className="h-5 w-5 text-[#E60076]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Supervisory Notification Preferences
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">New Leave Applications</p>
              <p className="text-slate-500 text-[11px]">Receive real-time alerts when a direct report applies for leave.</p>
            </div>
            <Switch checked={emailOnLeave} onCheckedChange={setEmailOnLeave} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Attendance Adjustments</p>
              <p className="text-slate-500 text-[11px]">Notify when a biometric discrepancy adjustment request is submitted.</p>
            </div>
            <Switch checked={emailOnAdjustment} onCheckedChange={setEmailOnAdjustment} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Overdue Task Alerts</p>
              <p className="text-slate-500 text-[11px]">Daily summary of team deliverables exceeding scheduled deadline.</p>
            </div>
            <Switch checked={emailOnTaskOverdue} onCheckedChange={setEmailOnTaskOverdue} />
          </div>
        </div>
      </div>
    </div>
  );
}

