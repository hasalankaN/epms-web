import type { EmployeeProfile, ProfileUpdateRequest } from "@/types/dto/profile.dto";

export const initialProfileUpdateRequests: ProfileUpdateRequest[] = [
  {
    id: "req-1",
    requestedAt: "2026-10-24 09:30 AM",
    summary: "Updated mobile number and residential address",
    status: "PENDING",
    reason: "Relocated to a new residence in Rajagiriya.",
    employeeName: "Nuwan Perera",
    employeeCode: "EMP-1042",
    departmentName: "Technology",
    changes: [
      { field: "Mobile Phone", oldValue: "+94 77 123 4567", newValue: "+94 77 888 9999" },
      { field: "Street Address", oldValue: "12/4 Temple Road", newValue: "45/2 Lake Drive, Rajagiriya" },
      { field: "City", oldValue: "Nugegoda", newValue: "Rajagiriya" },
    ],
  },
  {
    id: "req-2",
    requestedAt: "2026-08-15 14:10 PM",
    summary: "Added new professional qualification (AWS Certified Solutions Architect)",
    status: "APPROVED",
    decisionComment: "Verified certificate credential. Approved.",
    reason: "Completed AWS Solutions Architect Associate certification exam.",
    employeeName: "Nuwan Perera",
    employeeCode: "EMP-1042",
    departmentName: "Technology",
    changes: [
      { field: "Qualifications", oldValue: "B.Sc in Computing (Hons)", newValue: "B.Sc in Computing (Hons), AWS Certified SAA" },
    ],
  },
  {
    id: "req-3",
    requestedAt: "2026-05-10 11:20 AM",
    summary: "Change emergency contact phone",
    status: "REJECTED",
    decisionComment: "Provided secondary contact number is missing two digits. Please resubmit with full number.",
    reason: "Father changed his mobile network SIM card.",
    employeeName: "Nuwan Perera",
    employeeCode: "EMP-1042",
    departmentName: "Technology",
    changes: [
      { field: "Emergency Contact Mobile", oldValue: "+94 71 456 7890", newValue: "+94 71 456 78" },
    ],
  },
];

export const mockEmployeeProfile: EmployeeProfile = {
  id: "emp-1042",
  employeeCode: "EMP-1042",
  fullName: "Nuwan Pradeep Perera",
  email: "nuwan.perera@epms.lk",
  nic: "199418204910",
  dob: "1994-06-18",
  gender: "Male",
  contactNumber: "+94 77 123 4567",
  streetAddress: "45/2 Lake Drive, Rajagiriya",
  city: "Rajagiriya",
  province: "Western Province",
  epfNo: "EPF-88392",
  joinDate: "2022-03-01",
  qualification: "B.Sc in Computing (Hons) - University of Colombo, AWS Certified SAA",
  departmentName: "Technology",
  positionName: "Senior Software Engineer",
  supervisorName: "Kanishka Bandara",
  status: "ACTIVE",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  workExperiences: [
    {
      id: "exp-1",
      companyName: "Virtusa Pvt Ltd",
      designation: "Software Engineer",
      startDate: "2020-01-15",
      endDate: "2022-02-28",
    },
    {
      id: "exp-2",
      companyName: "Sysco LABS Sri Lanka",
      designation: "Associate Software Engineer",
      startDate: "2018-06-01",
      endDate: "2019-12-31",
    },
  ],
  emergencyContacts: [
    {
      id: "emg-1",
      name: "Thilini Perera",
      relationship: "Spouse",
      workPhone: "+94 11 234 5678",
      mobilePhone: "+94 77 987 6543",
    },
    {
      id: "emg-2",
      name: "Sunil Perera",
      relationship: "Father",
      workPhone: "+94 11 289 1234",
      mobilePhone: "+94 71 456 7890",
    },
  ],
  dependents: [
    {
      id: "dep-1",
      name: "Sithum Perera",
      dob: "2023-04-12",
      relationship: "Child",
      phone: "+94 77 123 4567",
    },
  ],
  updateRequests: initialProfileUpdateRequests,
};

