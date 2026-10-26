export interface DepartmentItem {
  id: string;
  department_id?: string;
  departmentName: string;
  department_name?: string;
  location: string;
  deptPhone: string;
  dept_phone?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  employeeCount?: number;
  employee_count?: number;
}

export interface CreateDepartmentDto {
  departmentName: string;
  location: string;
  deptPhone: string;
}

export interface UpdateDepartmentDto {
  id: string;
  departmentName?: string;
  location?: string;
  deptPhone?: string;
}

export interface DepartmentListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface DepartmentListResponse {
  items: DepartmentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
