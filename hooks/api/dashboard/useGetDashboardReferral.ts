import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface ReferralStats {
  totalReferralStaff: number;
  totalTeamLeaders: number;
  totalReferralEnrollments: number;
  totalReferralOrders: number;
  totalReferralSales: number;
}

export interface ReferralPendingStats {
  pendingApprovals: number;
  pendingReferralApprovals: number;
  pendingLeads: number;
  pendingFollowUps: number;
  pendingChat: number;
  pendingOrders: number;
}

export interface PendingApprovalItem {
  id: string;
  transactionDate: string;
  batchName: string;
  studentName: string;
  enrolledBy: string;
  whatsApp: string;
  amount: string;
  refNo: string;
  receiptUrl: string;
}

export interface ReferralApprovalItem {
  id: string;
  date: string;
  batchName: string;
  studentName: string;
  amount: string;
  referralMember: string;
  commissionRate: string;
  commissionAccumulated: string;
}

export interface PendingLeadItem {
  id: string;
  date: string;
  idNo: string;
  studentName: string;
  phone: string;
  whatsApp: string;
  district: string;
  interest: string;
  branch: string;
}

export interface PendingFollowUpItem {
  id: string;
  date: string;
  idNo: string;
  studentName: string;
  phone: string;
  whatsApp: string;
  source: string;
  assignee: string;
  district: string;
  interest: string;
  branch: string;
  status: string;
  followUp: string;
}

export interface PendingOrderItem {
  id: string;
  orderId: string;
  date: string;
  productName: string;
  productType: string;
  quantity: number;
  amount: number;
  customerName: string;
  paymentMethod: string;
  commissions: number;
  orderStatus: string;
}

export interface AgentItem {
  id: string;
  name: string;
  students: number;
  products: number;
  price: string;
}

export interface StudentItem {
  id: string;
  name: string;
  location: string;
  students: number;
  products: number;
  price?: string;
}

export interface DashboardReferralData {
  stats: ReferralStats;
  pendingStats: ReferralPendingStats;
  pendingApprovals: PendingApprovalItem[];
  referralApprovals: ReferralApprovalItem[];
  pendingLeads: PendingLeadItem[];
  pendingFollowUps: PendingFollowUpItem[];
  pendingOrders: PendingOrderItem[];
  topAgents: AgentItem[];
  recentAgents: AgentItem[];
  recentlyReferralStudents: StudentItem[];
  recentlyReferredStudents: StudentItem[];
}

export function useGetDashboardReferral() {
  return useQuery<DashboardReferralData>({
    queryKey: [queryKeys.dashboardReferral],
    queryFn: async () => {
      const res = await api.get<{ data: DashboardReferralData }>(
        API_ENDPOINTS.dashboard.REFERRAL,
      );

      return res.data.data;
    },
    staleTime: 60_000,
  });
}
