"use client";

import React, { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClockInMutation, useClockOutMutation } from "@/hooks/api/attendance/useAttendance";

export function AttendanceClockCard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [punchInTime, setPunchInTime] = useState<string>("08:32 AM");

  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleClock = () => {
    if (isClockedIn) {
      clockOutMutation.mutate(undefined, {
        onSuccess: () => {
          setIsClockedIn(false);
        },
      });
    } else {
      clockInMutation.mutate(undefined, {
        onSuccess: (data) => {
          setIsClockedIn(true);
          setPunchInTime(data.punchIn || "08:35 AM");
        },
      });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Work Shift · General (08:30 AM - 05:00 PM)
            </span>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            {currentTime || "08:30:00 AM"}
          </p>
          <p className="text-xs text-slate-500">{currentDate}</p>
        </div>

        {/* Punch Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <p className="text-slate-400 font-medium">Punch In</p>
            <p className="font-bold text-slate-900 dark:text-white mt-1">
              {isClockedIn ? punchInTime : "--:--"}
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {isClockedIn ? "On time" : "Not active"}
            </span>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Break Taken</p>
            <p className="font-bold text-slate-900 dark:text-white mt-1">1h 00m</p>
            <span className="text-[10px] text-slate-400">Standard allowance</span>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Recorded Hours</p>
            <p className="font-bold text-slate-900 dark:text-white mt-1">
              {isClockedIn ? "7h 15m" : "0h 00m"}
            </p>
            <span className="text-[10px] text-pink-600 dark:text-pink-400 font-medium">
              Target: 8h 00m
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Button
            onClick={handleToggleClock}
            disabled={clockInMutation.isPending || clockOutMutation.isPending}
            className={`w-full md:w-auto h-12 px-6 gap-2 font-bold text-sm shadow-md transition-all ${
              isClockedIn
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-[#E60076] hover:bg-[#d0006a] text-white"
            }`}
          >
            {isClockedIn ? (
              <>
                <LogOut className="h-4 w-4" />
                Clock Out (End Shift)
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Clock In (Start Shift)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

