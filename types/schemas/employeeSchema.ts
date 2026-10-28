import { z } from "zod";

export const employeeRegisterSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    join_date: z.string().min(1, "Join date is required"),
    employee_no: z.string().min(1, "Employee number is required"),
    epf_no: z.string().min(1, "EPF number is required"),
    work_email: z.string().email("Invalid work email format"),
    personal_email: z.string().email("Invalid personal email format").optional().or(z.literal("")),
    mobile_no: z.string().min(1, "Mobile number is required"),
    home_tp: z.string().optional(),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    country: z.string().min(1, "Country is required"),
    department_id: z.string().min(1, "Department is required"),
    position_id: z.string().min(1, "Position is required"),
    supervisor_id: z.string().optional(),
    role: z.enum(["admin", "hr", "supervisor", "employee"]),

    emergency_contacts: z.array(
        z.object({
            name: z.string().min(1, "Name is required"),
            relationship: z.string().min(1, "Relationship is required"),
            mobile: z.string().min(1, "Mobile is required"),
            home_tp: z.string().optional(),
            work_tp: z.string().optional(),
        })
    ),

    qualifications: z.array(
        z.object({
            qualification_title: z.string().min(1, "Title is required"),
            institute: z.string().min(1, "Institute is required"),
            completed_year: z.coerce.number().min(1950, "Invalid year"),
        })
    ),

    dependents: z.array(
        z.object({
            name: z.string().min(1, "Name is required"),
            relationship: z.string().min(1, "Relationship is required"),
            dob: z.string().min(1, "DOB is required"),
            mobile: z.string().optional(),
        })
    ),
});

export type EmployeeRegisterFormValues = z.infer<typeof employeeRegisterSchema>;