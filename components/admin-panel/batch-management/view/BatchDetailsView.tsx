"use client";

import React from "react";

import { BatchCoverHeader } from "./general/BatchCoverHeader";
import { BatchGeneralInfo } from "./general/BatchGeneralInfo";
import { BatchEnrollmentStats } from "./students/BatchEnrollmentStats";
import { BatchStudentDetails } from "./students/BatchStudentDetails";
import { BatchCertificateStats } from "./certificates/BatchCertificateStats";
import { BatchAllocatedCertificates } from "./certificates/BatchAllocatedCertificates";
import { BatchPaymentsTable } from "./financials/BatchPaymentsTable";
import { BatchRevenueCard } from "./financials/BatchRevenueCard";
import { BatchAccountCard } from "./financials/BatchAccountCard";

export function BatchDetailsView({ batchId }: { batchId: string }) {
  return (
    <div className="mt-3"> 
      {/* 
         Header Section 
         Spacing: 12px from top elements (mt-3 = 12px since 1 = 4px)
         User specified: "begins with cover image after 12px from back and generate button"
      */}
      <BatchCoverHeader batchId={batchId} />
      
      {/* Description Section */}
      <div className="mt-[12px] flex flex-col gap-1 w-full px-4 md:px-6"> 
          <h2 className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            Description
          </h2>
          <p className="font-inter text-[14px] font-normal leading-[20px] text-[#314158] flex-1">
            Lorem ipsum dolor sit amet consectetur. Quis tortor porttitor eget senectus. Non turpis duis ac proin turpis gravida. Vitae mi scelerisque blandit morbi magna. Facilisis aenean lectus arcu sodales rhoncus pellentesque euismod vel at. Diam a sem enim pharetra commodo at. Eget massa pellentesque vel turpis ornare. Arcu ligula mauris scelerisque enim in eu. Porta ultrices ac enim amet diam aliquet est bibendum. Id sollicitudin phasellus facilisis sit sagittis. Id risus risus praesent magna arcu.
          </p>
      </div>

      {/* General Info Card */}
      <div className="mt-4 w-full px-4 md:px-6">
         <BatchGeneralInfo />
      </div>

      {/* Enrollment Statistics Title */}
      <div className="mt-6 px-4 md:px-6">
          <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
            Enrollment Statistics
          </h2>
      </div>

      {/* Enrollment Statistics Card */}
      <div className="mt-4 w-full px-4 md:px-6">
         <BatchEnrollmentStats />
      </div>

      {/* Student Details Title (16px below enrollment stats) */}
      <div className="mt-4 px-4 md:px-6">
          <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
            Student Details
          </h2>
      </div>

      {/* Student Details Toolbar + Table (16px below title) */}
      <div className="mt-4 w-full px-4 md:px-6">
         <BatchStudentDetails />
      </div>

      {/* Certificate Details Title (16px below student details) */}
      <div className="mt-4 px-4 md:px-6">
          <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
            Certificate Details
          </h2>
      </div>

      {/* Certificate Stats Grid */}
      <div className="mt-4 px-4 md:px-6">
        <BatchCertificateStats />
      </div>

      {/* Allocated Certificates Title (16px below stats) */}
      <div className="mt-4 px-4 md:px-6">
          <h2 className="font-inter text-[16px] font-semibold leading-[24px] text-[#0F172B]">
            Allocated Certificates
          </h2>
      </div>

      {/* Allocated Certificates Table */}
      <div className="mt-4 w-full px-4 md:px-6">
          <BatchAllocatedCertificates />
      </div>

      {/* Batch Payments Title */}
      <div className="mt-6 px-4 md:px-6">
          <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
            Batch Payments
          </h2>
      </div>

      {/* Batch Payments Table (16px below title) */}
      <div className="mt-4 w-full px-4 md:px-6">
          <BatchPaymentsTable />
      </div>

      {/* Divider Line (15px below button) */}
      <div className="mt-[15px] px-4 md:px-6 w-full">
         <div className="h-[1px] w-full bg-[#E2E8F0]" />
      </div>

      {/* Revenue and Batch Account Section (16px below divider) */}
      <div className="mt-4 px-4 md:px-6 w-full flex flex-col lg:flex-row gap-4 mb-10">
        <BatchRevenueCard 
          completedPercentage={75}
          estimatedPayment="89,935"
          pendingPayment="19,935"
          className="flex-1"
        />
        <BatchAccountCard className="flex-1" />
      </div>
    </div>
  );
}
