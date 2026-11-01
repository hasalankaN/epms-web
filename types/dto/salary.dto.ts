export interface SalaryComponent {
  id: string;
  description: string;
  amount: number;
}

export interface SalarySummary {
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  effectiveDate?: string;
  allowances: any;
  deductions: any;
  currency?: string;
  epfEmployee?: number;
  epfEmployer?: number;
  etfEmployer?: number;
  breakdown?: any;
}

export interface SalarySlip {
  id: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  month: string;
  year?: number | string;
  basic: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  net: number;
  grossSalary?: number;
  totalDeductions?: number;
  netPayable?: number;
  status?: string;
  downloadUrl?: string;
  generatedOn?: string;
}

export interface EmployeeSalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  positionName: string;
  basicSalary: number;
  allowancesTotal: number;
  totalAllowances?: number;
  deductionsTotal: number;
  totalDeductions?: number;
  netSalary: number;
  effectiveDate?: string;
  status?: string;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
}

export interface BonusRecord {
  id: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  description?: string;
  title?: string;
  targetRole?: string;
  payoutDate?: string;
  status?: string;
  eligibleCount?: number;
  amount: number;
  month?: string;
  grantedDate?: string;
}

