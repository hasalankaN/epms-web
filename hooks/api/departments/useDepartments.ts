import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { departmentService } from "@/lib/api/department.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentListQuery,
  DepartmentListResponse,
} from "@/types/dto/department.dto";

export const useDepartmentsQuery = (query: DepartmentListQuery = { page: 1, pageSize: 10 }) => {
  return useQuery<DepartmentListResponse, Error>({
    queryKey: [queryKeys.departments, query],
    queryFn: () => departmentService.getDepartments(query),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentDto) => departmentService.createDepartment(payload),
    onSuccess: (newDept) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.departments] });
      toast.success(`Department "${newDept.departmentName}" created successfully!`);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create department. Department may already exist.";
      toast.error(msg);
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentDto }) =>
      departmentService.updateDepartment(id, payload),
    onSuccess: (updatedDept) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.departments] });
      toast.success(`Department "${updatedDept.departmentName}" updated successfully!`);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update department.";
      toast.error(msg);
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.departments] });
      toast.success("Department deleted successfully!");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete department.";
      toast.error(msg);
    },
  });
};
