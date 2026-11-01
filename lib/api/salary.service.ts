import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockSalarySummary,
  mockSalarySlips,
  mockEmployeeSalaryRecords,
  mockBonusRecords,
} from "@/lib/mock/salary.mock";
import type {
  SalarySummary,
  SalarySlip,
  EmployeeSalaryRecord,
  BonusRecord,
} from "@/types/dto/salary.dto";

let salaryRecordsStore: EmployeeSalaryRecord[] = [...mockEmployeeSalaryRecords];
let salarySlipsStore: SalarySlip[] = [...mockSalarySlips];
let bonusStore: BonusRecord[] = [...mockBonusRecords];

export const salaryService = {
  /**
   * GET /api/v1/me/salary
   */
  getMySalary: async (): Promise<SalarySummary> => {
    if (USE_MOCK) {
      return mockResponse(mockSalarySummary);
    }
    const res = await api.get(API_ENDPOINTS.me.SALARY);
    return res.data;
  },

  /**
   * GET /api/v1/me/salary-slips
   */
  getMySalarySlips: async (): Promise<SalarySlip[]> => {
    if (USE_MOCK) {
      return mockResponse(salarySlipsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.SALARY_SLIPS);
    return res.data;
  },

  /**
   * GET /api/v1/hr/salaries
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
    const res = await api.get(API_ENDPOINTS.hr.SALARIES, { params: { page, pageSize, search } });
    return res.data;
  },

  /**
   * PATCH /api/v1/hr/salaries/:id/adjust
   */
  adjustSalary: async (
    employeeId: string,
    newBasicSalary: number,
    effectiveDate: string,
    reason: string
  ): Promise<EmployeeSalaryRecord> => {
    if (USE_MOCK) {
      const rec = salaryRecordsStore.find((r) => r.employeeId === employeeId);
      if (rec) {
        rec.basicSalary = newBasicSalary;
        rec.effectiveDate = effectiveDate;
        rec.netSalary = newBasicSalary + rec.allowancesTotal - rec.deductionsTotal;
      }
      return mockResponse(rec || salaryRecordsStore[0]);
    }
    const res = await api.patch(`${API_ENDPOINTS.hr.SALARIES}/${employeeId}/adjust`, {
      newBasicSalary,
      effectiveDate,
      reason,
    });
    return res.data;
  },

  /**
   * GET /api/v1/hr/bonuses
   */
  getBonuses: async (): Promise<BonusRecord[]> => {
    if (USE_MOCK) {
      return mockResponse(bonusStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.BONUSES);
    return res.data;
  },

  /**
   * POST /api/v1/hr/bonuses
   */
  createBonus: async (payload: {
    employeeId: string;
    description: string;
    amount: number;
    month: string;
  }): Promise<BonusRecord> => {
    if (USE_MOCK) {
      const newBonus: BonusRecord = {
        id: `bon-${Date.now()}`,
        employeeId: payload.employeeId,
        employeeName: payload.employeeId === "emp-1042" ? "Nuwan Perera" : "Dilani Wickramasinghe",
        employeeCode: payload.employeeId === "emp-1042" ? "EMP-1042" : "EMP-1015",
        departmentName: "Technology",
        description: payload.description,
        amount: payload.amount,
        month: payload.month,
        grantedDate: new Date().toISOString().split("T")[0],
      };
      bonusStore = [newBonus, ...bonusStore];
      return mockResponse(newBonus);
    }
    const res = await api.post(API_ENDPOINTS.hr.BONUSES, payload);
    return res.data;
  },

  /**
   * POST /api/v1/hr/salary-slips/generate
   */
  generateSalarySlips: async (month: string): Promise<{ generatedCount: number; message: string }> => {
    if (USE_MOCK) {
      return mockResponse({ generatedCount: salaryRecordsStore.length, message: `Slips generated for ${month}` });
    }
    const res = await api.post(`${API_ENDPOINTS.hr.SALARY_SLIPS}/generate`, { month });
    return res.data;
  },
};

