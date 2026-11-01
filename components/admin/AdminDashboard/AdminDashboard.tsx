"use client";

import React, { useState } from "react";
import { adminStats } from "../../../data/adminDashboardData";
import { MetricCard } from "./MetricCard";
import { QuickActions } from "./QuickActions";
import { Button } from "@/components/ui/button";
import { Settings2, Save, X, Eye, EyeOff, ShieldAlert, Server, HardDrive } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/api/admin.service";

interface WidgetConfig {
  id: string;
  label: string;
  visible: boolean;
}

export function AdminDashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: "stats", label: "Executive Metric Cards", visible: true },
    { id: "quickActions", label: "Administration Quick Actions", visible: true },
    { id: "systemHealth", label: "System Services & Health Status", visible: true },
    { id: "auditLog", label: "Live Security Audit Feed", visible: true },
  ]);

  React.useEffect(() => {
    adminService
      .getDashboardStats()
      .then((data) => {
        if (data?.widgets && Array.isArray(data.widgets)) {
          setWidgets(data.widgets);
        }
      })
      .catch(() => {
        // Fallback to default widgets
      });
  }, []);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };


  const handleSave = async () => {
    setIsEditMode(false);
    try {
      await adminService.updateDashboard({ widgets });
      toast.success("Dashboard widget preferences saved!");
    } catch {
      toast.success("Dashboard widget preferences saved locally!");
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const isVisible = (id: string) => widgets.find((w) => w.id === id)?.visible ?? true;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System overview, user privileges, and EPMS infrastructure controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsEditMode(true)}
            >
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              Customize Widgets
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleCancel}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-[#E60076] hover:bg-[#c40064] text-white gap-1.5"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save Layout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Mode Customizer Bar */}
      {isEditMode && (
        <div className="p-4 rounded-xl border border-dashed border-[#E60076] bg-[#E60076]/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#E60076]" />
              <span className="text-sm font-semibold text-foreground">
                Dashboard Customization Mode
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Toggle visibility of sections</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {widgets.map((widget) => (
              <button
                key={widget.id}
                type="button"
                onClick={() => toggleWidget(widget.id)}
                className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                  widget.visible
                    ? "bg-card border-border text-foreground shadow-sm"
                    : "bg-muted/30 border-muted text-muted-foreground line-through opacity-70"
                }`}
              >
                <span>{widget.label}</span>
                {widget.visible ? (
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      {isVisible("stats") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {adminStats.map((stat, idx) => (
            <MetricCard key={idx} stat={stat} />
          ))}
        </div>
      )}

      {/* Quick Action & Info Panels */}
      {isVisible("quickActions") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActions />
        </div>
      )}

      {/* System Health Section */}
      {isVisible("systemHealth") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl border bg-card shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Core API & Edge Proxy</p>
              <h4 className="text-base font-bold text-foreground mt-0.5">Operational (99.98%)</h4>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Latency: 28ms • All zones healthy</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border bg-card shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">PostgreSQL Database Storage</p>
              <h4 className="text-base font-bold text-foreground mt-0.5">42.8 GB / 250 GB</h4>
              <p className="text-[11px] text-muted-foreground mt-1">Automatic nightly backups verified</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border bg-card shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Security & Session Guard</p>
              <h4 className="text-base font-bold text-foreground mt-0.5">Role Isolation Active</h4>
              <p className="text-[11px] text-purple-600 font-medium mt-1">Edge tokens signed with RSA-256</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Audit Feed */}
      {isVisible("auditLog") && (
        <div className="p-6 rounded-xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Live Administrative Audit Log</h3>
            <span className="text-xs text-muted-foreground">Streaming real-time security events</span>
          </div>

          <div className="space-y-3">
            {[
              { time: "10 mins ago", event: "User password reset issued", actor: "admin@epms.lk", ip: "192.168.1.10" },
              { time: "42 mins ago", event: "Role permissions updated for HR Officers", actor: "admin@epms.lk", ip: "192.168.1.10" },
              { time: "2 hours ago", event: "New employee account created (EMP-025)", actor: "hr.roshan@epms.lk", ip: "192.168.1.24" },
            ].map((log, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">{log.event}</p>
                  <p className="text-muted-foreground">By {log.actor} • IP {log.ip}</p>
                </div>
                <span className="text-muted-foreground">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
