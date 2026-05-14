"use client";

import { useState, useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, startOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, isToday, setYear } from "date-fns";

import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangeCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  className?: string;
  mode?: "single" | "range";
  minDate?: Date;
}

export function DateRangeCalendar({ startDate, endDate, onDateChange, className, mode = "range", minDate }: DateRangeCalendarProps) {
  const [leftMonth, setLeftMonth] = useState(() => startDate || new Date());
  const [rightMonth, setRightMonth] = useState(() => addMonths(startDate || new Date(), 1));
  const [selectingEnd, setSelectingEnd] = useState(false);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const endYear = currentYear + 100;

    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, []);

  const handlePrevLeft = () => {
    setLeftMonth((prev) => subMonths(prev, 1));
    setRightMonth((prev) => subMonths(prev, 1));
  };

  const handleNextRight = () => {
    setLeftMonth((prev) => addMonths(prev, 1));
    setRightMonth((prev) => addMonths(prev, 1));
  };

  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr);

    setLeftMonth((prev) => {
        const newDate = setYear(prev, year);

        setRightMonth(addMonths(newDate, 1));
        
        return newDate;
    });
  };

  const handleDayClick = (day: Date) => {
    if (mode === "single") {
       onDateChange(day, null);

       return;
    }

    if (!selectingEnd || !startDate) {
      onDateChange(day, null);
      setSelectingEnd(true);
    } else {
      if (day < startDate) {
        onDateChange(day, startDate);
      } else {
        onDateChange(startDate, day);
      }

      setSelectingEnd(false);
    }
  };

  const renderCalendar = (currentMonth: Date, showPrev: boolean, showNext: boolean) => {
    const monthStart = startOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

    // Always show 6 weeks (42 days) for consistent alignment
    const calendarEnd = new Date(calendarStart);

    calendarEnd.setDate(calendarStart.getDate() + 41);

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="flex w-full max-w-[320px] flex-col items-center justify-center gap-3 rounded-md border border-[#E4E4E7] bg-white p-2 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(16,24,40,0.10)] md:max-w-[280px] md:p-2 lg:max-w-[320px] lg:p-3">
        {/* Month Header */}
        <div className="flex w-full items-center justify-between">
          {showPrev ? (
            <button
              title="Previous month"
              type="button"
              onClick={handlePrevLeft}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E4E7] bg-white transition-colors hover:bg-[#F1F5F9]"
            >
              <ChevronLeft className="h-4 w-4 text-[#64748B]" />
            </button>
          ) : (
            <div className="w-8" />
          )}
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium leading-5 text-[#1D293D]">
              {format(currentMonth, "MMMM")}
            </span>
            <Select 
              value={currentMonth.getFullYear().toString()} 
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="h-7 w-fit border-none bg-transparent p-0 text-sm font-medium text-[#1D293D] shadow-none hover:bg-slate-50 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] z-[99999999]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {showNext ? (
            <button
              title="Next month"
              type="button"
              onClick={handleNextRight}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E4E7] bg-white transition-colors hover:bg-[#F1F5F9]"
            >
              <ChevronRight className="h-4 w-4 text-[#64748B]" />
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Weekday Headers */}
        <div className="grid w-full grid-cols-7 gap-1 md:gap-1 lg:gap-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="flex h-7 w-7 items-center justify-center text-xs font-medium leading-5 text-[#64748B] md:h-7 md:w-7 md:text-xs lg:h-8 lg:w-8 lg:text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid w-full grid-cols-7 gap-1 md:gap-1 lg:gap-2">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isStart = startDate && isSameDay(day, startDate);
            const isEnd = endDate && isSameDay(day, endDate);
            const isInRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
            const isSelected = isStart || isEnd;
            const isTodayDate = isToday(day);
            const isBeforeMinDate = minDate && day < minDate;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={isBeforeMinDate}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-xs font-normal leading-5 transition-colors md:h-7 md:w-7 md:text-xs lg:h-8 lg:w-8 lg:text-sm",
                  !isCurrentMonth && !isSelected && "text-[#CBD5E1]",
                  isBeforeMinDate && "cursor-not-allowed text-[#CBD5E1] opacity-50",
                  isCurrentMonth && !isSelected && !isInRange && !isTodayDate && !isBeforeMinDate && "bg-transparent text-[#1D293D] hover:bg-[#F1F5F9]",
                  !isCurrentMonth && !isSelected && !isBeforeMinDate && "hover:bg-[#F1F5F9]",
                  isTodayDate && !isSelected && !isInRange && !isBeforeMinDate && "bg-[#E2E8F0] text-[#1D293D]",
                  isInRange && !isSelected && "rounded-md bg-[#F1F5F9] text-[#1D293D]",
                  isSelected && "bg-[#0F172B] text-white"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:gap-3 lg:gap-4", className)}>
      {renderCalendar(leftMonth, true, mode === "single")}
      {mode === "range" && renderCalendar(rightMonth, false, true)}
    </div>
  );
}
