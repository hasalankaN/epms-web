/**
 * Enroll status options based on user feedback
 */
export type EnrollStatus = "On Going" | "Pending" | "Completed" | "Hold" | "Dropped";

/**
 * Enroll data structure for the table
 */
export interface EnrollDataType {
  id: string;
  date: string;
  type: string;
  studentId: string;
  studentName: string;
  phone: string;
  whatsapp: string;
  scope: string; // "Course" or "Batch"
  status: EnrollStatus;
}

/**
 * Status badge configuration based on precise user CSS values
 */
export const ENROLL_STATUS_CONFIG: Record<EnrollStatus, { bg: string; text: string }> = {
  "On Going": { bg: "#D9E9FF", text: "#2563EB" },
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Completed": { bg: "#DFFFF0", text: "#16A34A" },
  "Hold": { bg: "#FFDEDE", text: "#FB2C36" },
  "Dropped": { bg: "#F1F5F9", text: "#000000" },
};

/**
 * Mock data representing the user's provided design constraints
 */
export const DUMMY_ENROLL_DATA: EnrollDataType[] = [
  {
    id: "1",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "On Going",
  },
  {
    id: "2",
    date: "01/21",
    type: "Referral",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Batch",
    status: "Pending",
  },
  {
    id: "3",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "Completed",
  },
  {
    id: "4",
    date: "01/21",
    type: "Referral",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Batch",
    status: "Hold",
  },
  {
    id: "5",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "Dropped",
  },
  {
    id: "6",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "Completed",
  },
  {
    id: "7",
    date: "01/21",
    type: "Referral",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Batch",
    status: "Pending",
  },
  {
    id: "8",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "On Going",
  },
  {
    id: "9",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "On Going",
  },
  {
    id: "10",
    date: "01/21",
    type: "Direct",
    studentId: "#000001",
    studentName: "Amali Perera",
    phone: "+9470 492 2345",
    whatsapp: "+9470 492 2345",
    scope: "Course",
    status: "On Going",
  },
];
