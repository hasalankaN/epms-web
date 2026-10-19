"use client";

import React, { useState } from "react";

import {
  Calendar,
  Clock,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Star,
  Check,
} from "lucide-react";

import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";

export default function EmployeeDashboardPage() {
  const session = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Kasun";

  const [clockedIn, setClockedIn] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Prepare sprint demo slides",
      assignee: "Assigned by Nuwan Silva · due today",
      status: "In progress",
      statusClass: "bg-blue-50 text-blue-600 border border-blue-200/60",
      completed: false,
    },
    {
      id: 2,
      title: "Fix login validation bug",
      assignee: "Assigned by Nuwan Silva · due Oct 21",
      status: "To do",
      statusClass: "bg-neutral-100 text-neutral-600 border border-neutral-200/60",
      completed: false,
    },
    {
      id: 3,
      title: "Write API docs for leave module",
      assignee: "Assigned by Nuwan Silva · due Oct 23",
      status: "To do",
      statusClass: "bg-neutral-100 text-neutral-600 border border-neutral-200/60",
      completed: false,
    },
    {
      id: 4,
      title: "Review pull request #128",
      assignee: "Assigned by Nuwan Silva · due Oct 24",
      status: "In review",
      statusClass: "bg-purple-50 text-purple-600 border border-purple-200/60",
      completed: false,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
            Good morning, {firstName}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Here is what is happening with your work today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            className="h-9 px-3.5 text-xs font-medium border-neutral-200 text-neutral-800 hover:bg-neutral-50 gap-2 rounded-lg"
          >
            <Calendar className="h-3.5 w-3.5 text-neutral-600" />
            Apply leave
          </Button>
          <Button
            onClick={() => setClockedIn(!clockedIn)}
            className="h-9 px-3.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white gap-2 rounded-lg shadow-xs"
          >
            <Clock className="h-3.5 w-3.5" />
            {clockedIn ? "Clocked in" : "Clock in"}
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Annual leave left */}
        <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">
              Annual leave left
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">
              9 days
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-normal">
              of 14 days this year
            </p>
          </div>
        </div>

        {/* Card 2: Hours this week */}
        <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">
              Hours this week
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">
              32.5 h
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-normal">
              2 h under target so far
            </p>
          </div>
        </div>

        {/* Card 3: Attendance this month */}
        <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">
              Attendance this month
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-600">
              <Check className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">
              95%
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-normal">
              21 of 22 working days
            </p>
          </div>
        </div>

        {/* Card 4: Open tasks */}
        <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">
              Open tasks
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-600">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">
              4
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-normal">
              1 due today
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Hours worked chart & Today Clock widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hours worked this week (2 columns) */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Hours worked this week
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Target is 8 hours per day
              </p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 border border-neutral-200/60">
              Week 41
            </span>
          </div>

          {/* Bar Chart matching Image 2 */}
          <div className="mt-8 pt-4">
            <div className="grid grid-cols-5 gap-4 sm:gap-6 items-end h-44 pb-2">
              {/* Mon */}
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-neutral-600">8.2</span>
                <div
                  className="w-full max-w-[72px] rounded-t-md bg-[#2a9d8f] transition-all hover:opacity-90"
                  style={{ height: "82%" }}
                />
                <span className="text-xs text-neutral-400">Mon</span>
              </div>

              {/* Tue */}
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-neutral-600">8.0</span>
                <div
                  className="w-full max-w-[72px] rounded-t-md bg-[#2a9d8f] transition-all hover:opacity-90"
                  style={{ height: "80%" }}
                />
                <span className="text-xs text-neutral-400">Tue</span>
              </div>

              {/* Wed (Target under - orange/coral) */}
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-neutral-600">7.5</span>
                <div
                  className="w-full max-w-[72px] rounded-t-md bg-[#e76f51] transition-all hover:opacity-90"
                  style={{ height: "75%" }}
                />
                <span className="text-xs text-neutral-400">Wed</span>
              </div>

              {/* Thu */}
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-neutral-600">8.8</span>
                <div
                  className="w-full max-w-[72px] rounded-t-md bg-[#2a9d8f] transition-all hover:opacity-90"
                  style={{ height: "88%" }}
                />
                <span className="text-xs text-neutral-400">Thu</span>
              </div>

              {/* Fri */}
              <div className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-neutral-600">0.0</span>
                <div
                  className="w-full max-w-[72px] rounded-t-md bg-neutral-100 border-b border-neutral-300"
                  style={{ height: "4%" }}
                />
                <span className="text-xs text-neutral-400">Fri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today Clock Widget (1 column) */}
        <div className="rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Today</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Shift 8:30 AM to 5:30 PM
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {clockedIn ? "Clocked in" : "Not clocked in"}
              </span>
            </div>

            {/* Large Digital Clock */}
            <div className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 my-6">
              08 : 42
            </div>

            {/* Late Limit Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Late limit</span>
                <span className="font-semibold text-neutral-800">8:45 AM</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: "90%" }}
                />
              </div>
              <p className="text-xs text-neutral-500 pt-1 leading-relaxed">
                You can still clock in on time. 3 minutes left.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-6 mt-auto">
            <Button
              onClick={() => setClockedIn(true)}
              className="h-10 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Clock in
            </Button>
            <Button
              onClick={() => setClockedIn(false)}
              variant="outline"
              className="h-10 text-xs font-medium rounded-lg border-neutral-200 text-neutral-800 hover:bg-neutral-50"
            >
              Clock out
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Section: My Tasks & Coming Up */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* My Tasks (2 columns) */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">My tasks</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                4 open, 1 due today
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium rounded-lg border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              View all
            </Button>
          </div>

          <div className="divide-y divide-neutral-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/50 px-1 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold text-neutral-800 truncate ${
                        task.completed ? "line-through text-neutral-400" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {task.assignee}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${task.statusClass}`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Up (1 column) */}
        <div className="rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <div className="pb-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">Coming up</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Next 7 days</p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Event 1 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 mt-0.5">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 leading-tight">
                  Secure coding workshop
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 leading-tight">
                  Wed, Oct 21 · 10:00 AM · Training room
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 mt-0.5">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 leading-tight">
                  Self evaluation due
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 leading-tight">
                  Fri, Oct 23
                </p>
              </div>
            </div>

            {/* Event 3 */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900 leading-tight">
                  Leave request approved
                </p>
                <p className="text-[11px] text-neutral-400 mt-1 leading-tight">
                  Oct 28 to Oct 29 · Casual leave
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
