import type { MemberStatus } from "./user-management";

export interface ApiReferralAgentRow {
  id: string;
  member_code: string;
  first_name: string;
  last_name: string;
  district: string;
  status: MemberStatus | string;
  role: "LEADER" | "MEMBER" | string;
  created_at: string;
  students_count: number;
  products_count: number;
  commission_total: string;
}

export interface ReferralAgentDataType {
  id: string;
  regDate: string;
  idNo: string;
  name: string;
  district: string;
  phone: string;
  whatsApp: string;
  email: string;
  commissions: string;
  status: MemberStatus | string;
  isTeamLeader: boolean;
  noOfStudents: number;
  noOfProducts: number;
}

export interface GetReferralAgentsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  district?: string;
  status?: string;
}

export interface GetReferralAgentsResponse {
  results: ApiReferralAgentRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface ReferralAgentProfile {
  id: string;
  member_code: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  whatsapp: string;
  role: "LEADER" | "MEMBER" | string;
  status: "ACTIVE" | "INACTIVE" | string;
  district?: string;
  gender?: "MALE" | "FEMALE";
}

export interface ReferralAgentSummary {
  total_commissions: number;
  commissions_from_teams: number;
  direct_commissions: number;
  estimated_commissions: number;
  pending_commissions: number;
  commission_withdrawn: number;
  pending_withdrawals: number;
}

export interface ReferralAgentSummaryResponse {
  profile: ReferralAgentProfile;
  summary_cards: ReferralAgentSummary;
}

export interface UpdateReferralAgentPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: "MALE" | "FEMALE";
  phone?: string;
  whatsapp?: string;
  district?: string;
  role?: "LEADER" | "MEMBER";
}

// ── Payment Requests ──

export type PaymentRequestStatus = "PENDING" | "COMPLETED";
export type CommissionSourceType = "COURSE" | "BATCH" | "PRODUCT";
export type TransactionVia =
  | "BOC"
  | "PEOPLES_BANK"
  | "COMMERCIAL_BANK"
  | "HNB"
  | "ONLINE"
  | "CASH";

export interface ApiPaymentRequestRow {
  id: string;
  requested_date: string;
  member_id: string;
  member_code: string;
  member_name: string;
  requested_amount: string;
  requested_for_type: CommissionSourceType;
  requested_for_id: string;

  // Only present when COMPLETED
  paid_date?: string | null;
  bank_slip?: string | null;
}

export interface GetPaymentRequestsParams {
  page?: number;
  size?: number;
  search?: string;
  requested_date?: string;
}

export interface GetPaymentRequestsResponse {
  results: ApiPaymentRequestRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface ProcessPaymentPayload {
  description: string;
  amount: number;
  date: Date;
  transaction_via: TransactionVia;
  source_type: CommissionSourceType;
  source_id: string;
  receipt_url: string;
  notes?: string;
}
