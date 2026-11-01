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
  effectiveDate: string;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
}

export interface SalarySlip {
  id: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  month: string;
  basic: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  net: number;
  generatedOn: string;
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
  deductionsTotal: number;
  netSalary: number;
  effectiveDate: string;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
}

export interface BonusRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  description: string;
  amount: number;
  month: string;
  grantedDate: string;
}

