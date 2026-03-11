import { mockBranchData } from "@/components/admin-panel/branch-management/mockData";
import { BranchGeneralInfo } from "./BranchGeneralInfo";
import { BranchStatCard } from "./BranchStatCard";
import { BranchStaffDetails } from "./staff/BranchStaffDetails";
import { BranchBatchDetails } from "./batches/BranchBatchDetails";

interface BranchDetailsViewProps {
  branchId: string;
}

export function BranchDetailsView({ branchId }: BranchDetailsViewProps) {
  // Find the exact branch from mock data using ID
  const branchData = mockBranchData.find((b) => b.id === branchId) || mockBranchData[0];

  return (
    <div className="px-4 md:px-6 pb-12">
      <div className="flex flex-col gap-4 xl:flex-row xl:gap-6 mt-4">
        {/* Left Side: General Info Card */}
        <BranchGeneralInfo branch={branchData} />

        {/* Right Side: Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <BranchStatCard 
            label="Total No. of Staff" 
            value={branchData.staff_count} 
          />
          <BranchStatCard 
            label="Total No. of Batches" 
            value={branchData.batch_count} 
          />
          <BranchStatCard 
            label="Total Income" 
            value={`LKR ${branchData.total_income}`} 
          />
          <BranchStatCard 
            label="Total Expenses" 
            value={`LKR ${branchData.total_expenses}`} 
          />
        </div>
      </div>

      {/* Staff Details Title (24px below cards) */}
      <div className="mt-6">
          <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
            Staff Details
          </h2>
      </div>

      {/* Staff Details Toolbar + Table (16px below title) */}
      <div className="mt-4 w-full">
         <BranchStaffDetails />
      </div>

      {/* Batch Details Title (24px below staff table) */}
      <div className="mt-6">
          <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
            Batch Details
          </h2>
      </div>

      {/* Batch Details Toolbar + Table (16px below title) */}
      <div className="mt-4 w-full">
         <BranchBatchDetails />
      </div>
    </div>
  );
}
