"use client";

import React, { useState } from "react";
import {
  Building2,
  Shield,
  Server,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState<"company" | "security" | "system" | "notifications">("company");

  // Company State
  const [companyName, setCompanyName] = useState("Vogue Tex Garments (Pvt) Ltd");
  const [regNo, setRegNo] = useState("PV-98241");
  const [address, setAddress] = useState("No. 45, Biyagama Export Processing Zone, Sri Lanka");
  const [currency, setCurrency] = useState("LKR (Rs.)");
  const [timezone, setTimezone] = useState("Asia/Colombo (GMT+5:30)");

  // Security State
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [mfaRequired, setMfaRequired] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [passwordComplexity, setPasswordComplexity] = useState(true);

  // System State
  const [backupFrequency, setBackupFrequency] = useState("DAILY");
  const [biometricSyncInterval, setBiometricSyncInterval] = useState("15");
  const [logRetentionDays, setLogRetentionDays] = useState("90");

  // Notifications State
  const [smtpServer, setSmtpServer] = useState("smtp.epms.garments.lk");
  const [smtpPort, setSmtpPort] = useState("587");
  const [senderEmail, setSenderEmail] = useState("notifications@epms.lk");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("System configurations saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System & Enterprise Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure organization parameters, edge security controls, database backup policies, and integrations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("company")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "company"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company & Locale
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "security"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="w-4 h-4" />
          Security & Access Policy
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "system"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Server className="w-4 h-4" />
          Biometric & Backups
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "notifications"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="w-4 h-4" />
          SMTP & Gateways
        </button>
      </div>

      <div className="p-6 rounded-xl border bg-card shadow-sm max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Company Tab */}
          {activeTab === "company" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Registered Legal Entity Name</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Company Registration No.</Label>
                  <Input
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Reporting Currency</Label>
                  <Input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Operating Headquarters & Factory Address</Label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>System Timezone</Label>
                <Input
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Inactivity Session Timeout (Minutes)</Label>
                  <Input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Minimum Password Length</Label>
                  <Input
                    type="number"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mfaRequired}
                    onChange={(e) => setMfaRequired(e.target.checked)}
                    className="rounded border-gray-300 text-[#E60076] focus:ring-[#E60076]"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Enforce Multi-Factor Authentication (MFA)</span>
                    <p className="text-xs text-muted-foreground">Mandatory for Admin, HR and Finance accounts</p>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={passwordComplexity}
                    onChange={(e) => setPasswordComplexity(e.target.checked)}
                    className="rounded border-gray-300 text-[#E60076] focus:ring-[#E60076]"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">Require Complex Characters in Password</span>
                    <p className="text-xs text-muted-foreground">Requires uppercase, lowercase, numbers and symbols</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === "system" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Database Snapshot Backup Frequency</Label>
                <select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="HOURLY">Every Hour (Critical Transactional)</option>
                  <option value="DAILY">Daily at 02:00 AM UTC (Standard)</option>
                  <option value="WEEKLY">Weekly Full Dump</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Biometric Terminal Sync Interval (Mins)</Label>
                  <Input
                    type="number"
                    value={biometricSyncInterval}
                    onChange={(e) => setBiometricSyncInterval(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Audit Log Retention (Days)</Label>
                  <Input
                    type="number"
                    value={logRetentionDays}
                    onChange={(e) => setLogRetentionDays(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Outbound SMTP Relay Server</Label>
                <Input
                  value={smtpServer}
                  onChange={(e) => setSmtpServer(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>SMTP Port</Label>
                  <Input
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Default Sender Email</Label>
                  <Input
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            >
              <Save className="w-4 h-4" />
              Save Configuration Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

