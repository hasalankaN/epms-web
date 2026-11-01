import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roleService } from "@/lib/api/role.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateRoleDto } from "@/types/dto/role.dto";

export const useRolesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.adminRoles],
    queryFn: () => roleService.getRoles(),
  });
};

export const usePermissionModulesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.adminRoles, "permissions"],
    queryFn: () => roleService.getPermissionModules(),
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleDto) => roleService.createRole(payload),
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.adminRoles] });
      toast.success(`Role "${newRole.name}" created successfully!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create role.");
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.adminRoles] });
      toast.success("Role removed successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Cannot delete role.");
    },
  });
};

