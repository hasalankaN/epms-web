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

const SAMPLE_BATCHES = [
  {
    id: "1",
    batchName: "Batch Name",
    batchNumber: "Batch Number #1234",
    courseName: "Marketing Course",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
    startDate: "2025.12.23",
    endDate: "2026.02.23",
    description: "Short Description: Lorem ipsum dolor sit amet consectetur.",
    progress: 40,
  },
  {
    id: "2",
    batchName: "Batch Name",
    batchNumber: "Batch Number #1234",
    courseName: "Marketing Course",
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60",
    startDate: "2025.12.23",
    endDate: "2026.02.23",
    description: "Short Description: Lorem ipsum dolor sit amet consectetur.",
    progress: 60,
  },
  {
    id: "3",
    batchName: "Batch Name",
    batchNumber: "Batch Number #1234",
    courseName: "Marketing Course",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    startDate: "2025.12.23",
    endDate: "2026.02.23",
    description: "Short Description: Lorem ipsum dolor sit amet consectetur.",
    progress: 20,
  },
  {
    id: "4",
    batchName: "Batch Name",
    batchNumber: "Batch Number #1234",
    courseName: "Business Analytics",
    thumbnail: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=60",
    startDate: "2025.12.23",
    endDate: "2026.02.23",
    description: "Short Description: Lorem ipsum dolor sit amet consectetur.",
    progress: 80,
  },
  {
    id: "5",
    batchName: "Batch Name",
    batchNumber: "Batch Number #1234",
    courseName: "Business Analytics",
    thumbnail: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop&q=60",
    startDate: "2025.12.23",
    endDate: "2026.02.23",
    description: "Short Description: Lorem ipsum dolor sit amet consectetur.",
    progress: 55,
  },
];

export default function BatchesPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-10"
    >
      <div className="flex flex-wrap gap-6">
        {SAMPLE_BATCHES.map((batch) => (
          <motion.div key={batch.id} variants={itemVariants}>
            <BatchCard {...batch} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
