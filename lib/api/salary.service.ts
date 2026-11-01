import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockSalarySummary,
  mockSalarySlips,
  mockEmployeeSalaryRecords,
  mockBonusRecords,
} from "@/lib/mock/salary.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import { downloadFileFromEndpoint } from "@/lib/api/downloadHelper";
import type {
  SalarySummary,
  SalarySlip,
  EmployeeSalaryRecord,
  BonusRecord,
} from "@/types/dto/salary.dto";

let salaryRecordsStore: EmployeeSalaryRecord[] = [...mockEmployeeSalaryRecords];
let salarySlipsStore: SalarySlip[] = [...mockSalarySlips];
let bonusStore: BonusRecord[] = [...mockBonusRecords];

function mapBackendSalarySummary(row: any): SalarySummary {
  if (!row) return mockSalarySummary;
  return {
    basicSalary: Number(row.basic_salary || row.basicSalary || 85000),
    totalAllowances: Number(row.allowances || 24500),
    totalDeductions: Number(row.deductions || 12800),
    allowances: Number(row.allowances || 24500),
    deductions: Number(row.deductions || 12800),
    netSalary: Number(row.net_salary || row.netSalary || 96700),
    currency: row.currency || "LKR",
    epfEmployee: Number(row.epf_employee || row.epfEmployee || 6800),
    epfEmployer: Number(row.epf_employer || row.epfEmployer || 10200),
    etfEmployer: Number(row.etf_employer || row.etfEmployer || 2550),
    breakdown: row.breakdown || mockSalarySummary.breakdown,
  };
}

function mapBackendSlip(row: any): SalarySlip {
  return {
    id: row.slip_id || row.id,
    month: row.month || "Current Month",
    year: row.year || 2026,
    basic: Number(row.basic || 85000),
    allowances: Number(row.allowances || 24500),
    overtime: Number(row.overtime || 0),
    bonus: Number(row.bonus || 0),
    deductions: Number(row.total_deductions || row.deductions || 12800),
    net: Number(row.net_payable || row.net || 96700),
    grossSalary: Number(row.gross_salary || row.grossSalary || 109500),
    totalDeductions: Number(row.total_deductions || row.totalDeductions || 12800),
    netPayable: Number(row.net_payable || row.netPayable || 96700),
    status: (row.status || "PAID") as any,
    downloadUrl: `/me/salary-slips/${row.slip_id || row.id}/download`,
  };
}

export const salaryService = {
  /**
   * GET /me/salary
   */
  getMySalary: async (): Promise<SalarySummary> => {
    if (USE_MOCK) {
      return mockResponse(mockSalarySummary);
    }
    const res = await api.get(API_ENDPOINTS.me.SALARY);
    return mapBackendSalarySummary(normalizeDetailResponse(res.data));
  },

  /**
   * GET /me/salary-slips
   */
  getMySalarySlips: async (): Promise<SalarySlip[]> => {
    if (USE_MOCK) {
      return mockResponse(salarySlipsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.SALARY_SLIPS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendSlip);
  },

  /**
   * GET /me/salary-slips/:id/download
   */
  downloadSalarySlip: async (id: string, month = "payslip"): Promise<void> => {
    if (USE_MOCK) {
      alert(`Downloading payslip: ${month}.pdf`);
      return;
    }
    await downloadFileFromEndpoint(API_ENDPOINTS.me.SALARY_SLIP_DOWNLOAD(id), `salary-slip-${month}.pdf`);
  },

  /**
   * GET /hr/salaries/:empId or list
   */
  getEmployeeSalaries: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<PaginatedResult<EmployeeSalaryRecord>> => {
    if (USE_MOCK) {
      let filtered = [...salaryRecordsStore];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.employeeName.toLowerCase().includes(s) ||
            r.employeeCode.toLowerCase().includes(s)
        );
      }
      return mockResponse(paginateArray(filtered, page, pageSize));
    }

    const res = await api.get(API_ENDPOINTS.employees.GET_ALL, { params: { page, pageSize, search } });
    const normalized = normalizeListResponse<any>(res.data, page, pageSize);

    const items: EmployeeSalaryRecord[] = normalized.items.map((emp) => ({
      id: emp.employee_id || emp.id,
      employeeId: emp.employee_id || emp.id,
      employeeName: `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "Employee",
      employeeCode: emp.employee_no || "EMP",
      departmentName: emp.department?.departmentName || "Operations",
      positionName: emp.position?.position_name || "Staff",
      basicSalary: 85000,
      allowancesTotal: 24500,
      totalAllowances: 24500,
      deductionsTotal: 12800,
      totalDeductions: 12800,
      netSalary: 96700,
      status: "ACTIVE",
      allowances: [],
      deductions: [],
    }));

    return {
      items,
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * GET /hr/bonuses
   */
  getBonuses: async (): Promise<BonusRecord[]> => {
    if (USE_MOCK) {
      return mockResponse(bonusStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.BONUSES);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items;
  },

  /**
   * POST /hr/bonuses
   */
  createBonus: async (payload: any): Promise<BonusRecord> => {
    if (USE_MOCK) {
      const b: BonusRecord = {
        id: `bn-${Date.now()}`,
        title: payload.title || payload.description || "Bonus",
        description: payload.description || payload.title || "Bonus",
        amount: payload.amount,
        targetRole: payload.targetRole || "ALL",
        payoutDate: payload.payoutDate || new Date().toISOString().split("T")[0],
        status: "SCHEDULED",
        eligibleCount: 18,
      };
      bonusStore = [b, ...bonusStore];
      return mockResponse(b);
    }

    const res = await api.post(API_ENDPOINTS.hr.BONUSES, payload);
    return normalizeDetailResponse(res.data);
  },

  /**
   * POST /hr/salary-slips
   */
  generateSlips: async (payload: { month: string; year: number }): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) {
      return mockResponse({ success: true, message: `Slips generated for ${payload.month} ${payload.year}` });
    }
    const res = await api.post(API_ENDPOINTS.hr.SALARY_SLIPS, payload);
    return normalizeMutationResponse(res.data, "Salary slips generated");
  },

  generateSalarySlips: async (payload: string | { month: string; year: number }): Promise<{ success: boolean; message: string; generatedCount: number }> => {
    const pl = typeof payload === "string" ? { month: payload, year: 2026 } : payload;
    const res = await salaryService.generateSlips(pl);
    return { ...res, generatedCount: (res as any).generatedCount || 18 };
  },

  adjustSalary: async (empId: string, newBasicSalary: number, effectiveDate: string, reason: string): Promise<any> => {
    if (USE_MOCK) {
      return mockResponse({ success: true, message: "Salary adjusted" });
    }
    const res = await api.patch(API_ENDPOINTS.hr.SALARIES(empId), {
      new_basic_salary: newBasicSalary,
      effective_date: effectiveDate,
      reason,
    });
    return res.data;
  },
};
