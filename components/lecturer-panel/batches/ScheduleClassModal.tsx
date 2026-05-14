"use client";

import { useState } from "react";

import { startOfToday } from "date-fns";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { useCreateContentMaterial } from "@/hooks/api/lecturers/useCreateContentMaterial";

interface ScheduleClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierId: string;
  onSuccess?: () => void;
}

export function ScheduleClassModal({ isOpen, onClose, tierId, onSuccess }: ScheduleClassModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());
  const [startTime, setStartTime] = useState({ hour: "09", minute: "30", ampm: "AM" });
  const [endTime, setEndTime] = useState({ hour: "11", minute: "30", ampm: "AM" });
  const [title, setTitle] = useState("");
  const [zoomLink, setZoomLink] = useState("");

  const { mutate: createMaterial, isPending } = useCreateContentMaterial();

  const handleSave = () => {
    if (!selectedDate) return;
    
    if (!tierId) {
      console.warn("ScheduleClassModal: tierId is missing. API call aborted.");

      return;
    }

    const startDateTime = new Date(selectedDate);
    let startHour = parseInt(startTime.hour);

    if (startTime.ampm === "PM" && startHour !== 12) startHour += 12;
    if (startTime.ampm === "AM" && startHour === 12) startHour = 0;
    startDateTime.setHours(startHour, parseInt(startTime.minute));

    const endDateTime = new Date(selectedDate);
    let endHour = parseInt(endTime.hour);

    if (endTime.ampm === "PM" && endHour !== 12) endHour += 12;
    if (endTime.ampm === "AM" && endHour === 12) endHour = 0;
    endDateTime.setHours(endHour, parseInt(endTime.minute));

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    createMaterial({
      tier_id: tierId,
      material_type: "ZOOM",
      title,
      zoom_link: zoomLink,
      zoom_start_time: startDateTime.toISOString(),
      zoom_duration: durationHours > 0 ? durationHours : 1,
    }, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[368px] max-w-[368px] p-0 gap-0 bg-white border border-[#E2E8F0] shadow-lg rounded-[12px] !font-inter overflow-hidden mx-auto h-fit max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <DialogHeader className="h-12 border-b border-[#E2E8F0] px-6 flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-[18px] font-semibold text-[#0F172B] leading-[30px]">
            Schedule Class
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="p-6 flex flex-col gap-4 items-center sm:items-start pb-8">
            <div className="w-full">
              <Label className="text-[14px] font-semibold text-[#0F172B] leading-[20px] mb-4 block text-center sm:text-left">
                By Date
              </Label>

              <div className="w-full sm:w-[320px] border border-[#E9E9EB] rounded-[15px] p-3 shadow-sm bg-white flex flex-col items-center mx-auto">
                <div className="w-full sm:w-[296px]">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full p-0"
                    classNames={{
                      months: "w-full",
                      month: "space-y-4 w-full",
                      month_caption: "flex justify-between items-center h-11 relative",
                      caption_label: "text-[16px] font-medium text-[#F6339A] !font-roboto absolute left-1/2 -translate-x-1/2",
                      nav: "flex items-center gap-1.5 ml-auto",
                      button_previous: "h-7.5 w-7.5 bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 rounded-full static",
                      button_next: "h-7.5 w-7.5 bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 rounded-full static",
                      month_grid: "w-full border-collapse",
                      weekdays: "flex justify-between mb-2",
                      weekday: "text-[#C3C3C5] w-8 font-medium text-[12px] sm:text-[14px] !font-roboto text-center uppercase",
                      week: "flex w-full justify-between mt-2",
                      day: cn(
                        "h-8 w-8 p-0 font-normal !font-roboto flex items-center justify-center transition-colors cursor-pointer rounded-full hover:bg-gray-100 text-[#202020] text-[14px] sm:text-[16px]"
                      ),
                      selected: "!bg-[#F6339A] !text-white hover:!bg-[#F6339A]",
                      today: "bg-[#D8D8DA] text-[#202020]",
                      outside: "text-[#C3C3C5] opacity-50",
                      disabled: "text-[#C3C3C5] opacity-50",
                      hidden: "invisible",
                    }}
                  />
                </div>

                <div className="w-full sm:w-[296px] h-[1px] bg-[#F0F3F7] my-2" />

                <div className="w-full sm:w-[296px] space-y-2 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] sm:text-[16px] font-medium text-[#0F172B] !font-roboto">Start Time</span>
                    <TimePicker value={startTime} onChange={setStartTime} />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] sm:text-[16px] font-medium text-[#0F172B] !font-roboto">End Time</span>
                    <TimePicker value={endTime} onChange={setEndTime} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-1">
                <div className="flex gap-0.5">
                  <Label className="text-[14px] font-medium text-[#1D293D]">Title</Label>
                  <span className="text-[#FB2C36] text-[14px]">*</span>
                </div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="eg: Title"
                  className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm text-[14px] italic placeholder:text-[#90A1B9] placeholder:not-italic w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex gap-0.5">
                  <Label className="text-[14px] font-medium text-[#1D293D]">Zoom Link</Label>
                  <span className="text-[#FB2C36] text-[14px]">*</span>
                </div>
                <Input
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  placeholder="htpps//:"
                  className="h-9 rounded-[6px] border-[#E2E8F0] shadow-sm text-[14px] italic placeholder:text-[#90A1B9] placeholder:not-italic w-full"
                />
              </div>
            </div>

            <div className="flex justify-end w-full mt-2">
              <Button
                onClick={handleSave}
                disabled={isPending || !title || !zoomLink || !selectedDate || !tierId}
                className="bg-[#E60076] hover:bg-[#C50065] text-white px-4 h-10 rounded-[6px] text-[14px] font-semibold shadow-sm w-full sm:w-20"
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TimePicker({ 
  value, 
  onChange 
}: { 
  value: { hour: string; minute: string; ampm: string }; 
  onChange: (val: { hour: string; minute: string; ampm: string }) => void 
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#F1F5F9] rounded-[5px] px-2 py-1 h-8 flex items-center gap-1">
        <input
          type="text"
          value={value.hour}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);

            onChange({ ...value, hour: val });
          }}
          placeholder="00"
          className="bg-transparent w-[18px] text-center text-[16px] font-normal text-[#1D293D] !font-roboto focus:outline-none"
        />
        <span className="text-[#1D293D] !font-roboto text-[16px]">:</span>
        <input
          type="text"
          value={value.minute}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);

            onChange({ ...value, minute: val });
          }}
          placeholder="00"
          className="bg-transparent w-[18px] text-center text-[16px] font-normal text-[#1D293D] !font-roboto focus:outline-none"
        />
      </div>
      
      <div className="bg-[#F1F5F9] rounded-[10px] p-0.5 h-8 flex items-center w-[101px]">
        <button
          onClick={() => onChange({ ...value, ampm: "AM" })}
          className={cn(
            "flex-1 h-full rounded-[8px] text-[14px] font-normal !font-roboto transition-all flex items-center justify-center",
            value.ampm === "AM" ? "bg-white text-[#1D293D] border-[0.5px] border-black/5 shadow-md" : "text-[#1D293D]"
          )}
        >
          AM
        </button>
        <button
          onClick={() => onChange({ ...value, ampm: "PM" })}
          className={cn(
            "flex-1 h-full rounded-[8px] text-[14px] font-normal !font-roboto transition-all flex items-center justify-center",
            value.ampm === "PM" ? "bg-white text-[#1D293D] border-[0.5px] border-black/5 shadow-md" : "text-[#1D293D]"
          )}
        >
          PM
        </button>
      </div>
    </div>
  );
}
