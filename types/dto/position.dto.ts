export interface PositionItem {
  id: string;
  position_id?: string;
  positionName: string;
  position_name?: string;
  description?: string;
  effectiveDate?: string;
  effective_date?: string;
  departmentId?: string;
  department_id?: string;
  departmentName?: string;
  department_name?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  employeeCount?: number;
  employee_count?: number;
}

export interface CreatePositionDto {
  positionName: string;
  description?: string;
  effectiveDate?: string;
}

export interface PositionListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PositionListResponse {
  items: PositionItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
