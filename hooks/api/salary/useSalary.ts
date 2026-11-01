import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salaryService } from "@/lib/api/salary.service";
import { queryKeys } from "@/lib/constants/queryKeys";

export const useMySalaryQuery = () => {
  return useQuery({
    queryKey: [queryKeys.salaryDetails],
    queryFn: () => salaryService.getMySalary(),
  });
};

export const useMySalarySlipsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.salarySlips],
    queryFn: () => salaryService.getMySalarySlips(),
  });
};

export const useEmployeeSalariesQuery = (page = 1, pageSize = 10, search?: string) => {
  return useQuery({
    queryKey: [queryKeys.payrollEmployees, page, pageSize, search],
    queryFn: () => salaryService.getEmployeeSalaries(page, pageSize, search),
  });
};

export const useAdjustSalaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      newBasicSalary,
      effectiveDate,
      reason,
    }: {
      employeeId: string;
      newBasicSalary: number;
      effectiveDate: string;
      reason: string;
    }) =>
      salaryService.adjustSalary(employeeId, newBasicSalary, effectiveDate, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.payrollEmployees] });
      toast.success("Employee salary successfully adjusted!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to adjust salary.");
    },
  });
};

export const useBonusesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.bonuses],
    queryFn: () => salaryService.getBonuses(),
  });
};

export const useCreateBonusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      employeeId: string;
      description: string;
      amount: number;
      month: string;
    }) => salaryService.createBonus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bonuses] });
      toast.success("Bonus allocated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to grant bonus.");
    },
  });
};

export const useGenerateSalarySlipsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (month: string) => salaryService.generateSalarySlips(month),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.salarySlips] });
      toast.success(`Generated ${data.generatedCount} salary slips successfully!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to generate slips.");
    },
  });
};

