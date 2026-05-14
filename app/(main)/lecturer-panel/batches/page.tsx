"use client";

import { motion } from "framer-motion";

import { BatchCard } from "@/components/lecturer-panel/batches/BatchCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};


import { useGetLecturerBatches } from "@/hooks/api/batches/useGetLecturerBatches";
import { useGetLecturerProfile } from "@/hooks/api/lecturers/useGetLecturerProfile";
import { Skeleton } from "@/components/ui/skeleton";

export default function BatchesPage() {
  const { data: profile, isLoading: isProfileLoading } = useGetLecturerProfile();
  
  const { data: batchesData, isLoading: isBatchesLoading } = useGetLecturerBatches(profile?.userId || "");
  const batches = batchesData?.results || [];

  const isLoading = isProfileLoading || isBatchesLoading;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[302px] w-[288px] rounded-[8px]" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-10"
    >
      <div className="flex flex-wrap gap-6">
        {batches.length > 0 ? (
          batches.map((batch) => (
            <motion.div key={batch.id} variants={itemVariants}>
              <BatchCard 
                id={batch.id}
                batchName={batch.name}
                batchNumber={batch.custom_id}
                courseName={batch.name}
                thumbnail={batch.cover_image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60"}
                startDate={batch.start_date ? batch.start_date.replace(/-/g, '.') : "N/A"}
                endDate={batch.end_date ? batch.end_date.replace(/-/g, '.') : "N/A"}
                description={`Branch: ${batch.branch_name} | Language: ${batch.language}`}
                progress={batch.is_paid ? 100 : 20}
              />
            </motion.div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-lg font-medium">No batches found.</p>
            <p className="text-sm">Assigned batches will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
