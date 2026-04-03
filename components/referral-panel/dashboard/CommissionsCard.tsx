import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

interface StatRowItemProps {
  label: string;
  value: string;
  className?: string;
}

function StatRowItem({ label, value, className }: StatRowItemProps) {
  return (
    <div className={cn(
      "flex flex-1 flex-col items-center justify-center gap-1",
      "rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none",
      className
    )}>
      <span className="text-center font-sans text-sm font-normal leading-5 text-[#314158]">
        {label}
      </span>
      <span className="text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

interface CommissionSectionProps {
  title: string;
  totalAmount: string;
  batches: string;
  courses: string;
  products: string;
}

function CommissionSection({ title, totalAmount, batches, courses, products }: CommissionSectionProps) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-sans text-sm font-medium leading-5 text-[#1D293D]">
          {title}
        </span>
        <div className="flex items-center gap-1 font-sans text-sm font-medium leading-5">
          <span className="text-[#62748E]">Total Amount:</span>
          <span className="text-[#E60076]">{totalAmount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#E2E8F0] sm:rounded-lg sm:border sm:border-[#E2E8F0] sm:bg-transparent sm:py-[36px]">
        <StatRowItem label="Batches" value={batches} />
        <StatRowItem label="Courses" value={courses} />
        <StatRowItem label="Products" value={products} />
      </div>
    </div>
  );
}

export function CommissionsCard() {
  return (
    <div className="mt-6 flex w-full flex-col items-start gap-4 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
      <h2 className="font-sans text-xl font-semibold leading-[32px] text-[#1D293D]">
        Total Commissions
      </h2>

      <CommissionSection
        title="Direct Commissions"
        totalAmount="LKR XXXX.00"
        batches="XXXX.00"
        courses="XXXX.00"
        products="XXXX.00"
      />

      <CommissionSection
        title="Team Commissions"
        totalAmount="LKR XXXX.00"
        batches="XXXX.00"
        courses="XXXX.00"
        products="XXXX.00"
      />

      {/* Separator */}
      <div className="h-[1px] w-full bg-[#E2E8F0]" />

      {/* Available Balance Payments */}
      <div className="flex w-full flex-col gap-3 rounded-lg bg-[#DFFFF0] p-[8px_12px] md:flex-row md:items-center md:justify-between">
        <span className="font-sans text-base font-semibold leading-6 text-[#16A34A]">
          Available Balance Payments
        </span>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 md:gap-4">
          <span className="font-sans text-base font-semibold leading-6 text-[#16A34A]">
            LKR XXXX.00
          </span>
          <button className={cn(BUTTON_STYLES.dark.sm, "w-full sm:w-auto")}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
}
