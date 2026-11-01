import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { attendanceService, type AttendanceFilterQuery } from "@/lib/api/attendance.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateAdjustmentRequestDto } from "@/types/dto/attendance.dto";

export const useMyAttendanceQuery = (query: AttendanceFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.attendance, query],
    queryFn: () => attendanceService.getMyAttendance(query),
  });
};

export const useTeamAttendanceQuery = (query: AttendanceFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.teamAttendance, query],
    queryFn: () => attendanceService.getTeamAttendance(query),
  });
};

export const useAttendanceStatsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.attendance, "stats"],
    queryFn: () => attendanceService.getAttendanceStats(),
  });
};

export const useAdjustmentRequestsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.attendanceAdjustments],
    queryFn: () => attendanceService.getAdjustmentRequests(),
  });
};

export const useClockInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => attendanceService.clockIn(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.attendance] });
      toast.success(data.message);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Clock in failed.");
    },
  });
};

export const useClockOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => attendanceService.clockOut(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.attendance] });
      toast.success(data.message);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Clock out failed.");
    },
  });
};

export const useCreateAdjustmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdjustmentRequestDto) =>
      attendanceService.createAdjustmentRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.attendanceAdjustments] });
      toast.success("Adjustment request submitted to supervisor!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit adjustment request.");
    },
  });
};

export const useDecideAdjustmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      decision,
      comment,
    }: {
      id: string;
      decision: "APPROVED" | "REJECTED";
      comment: string;
    }) => attendanceService.decideAdjustmentRequest(id, decision, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.attendanceAdjustments] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamAttendance] });
      toast.success(
        `Adjustment ${variables.decision === "APPROVED" ? "approved" : "rejected"}!`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to process adjustment.");
    },
  });
};

export const useUpdateAttendanceRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { punchIn: string; punchOut: string; reason: string };
    }) => attendanceService.updateAttendanceRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamAttendance] });
      toast.success("Attendance record updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update attendance record.");
    },
  });
};

export const useOvertimeRecordsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.attendance, "overtime"],
    queryFn: () => attendanceService.getOvertimeRecords(),
  });
};

