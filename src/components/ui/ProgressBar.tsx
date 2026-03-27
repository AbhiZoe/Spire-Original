"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

function getColor(value: number) {
  if (value < 33) return "bg-red-400";
  if (value < 66) return "bg-amber-400";
  return "bg-emerald-500";
}

export function ProgressBar({
  value,
  className,
  showLabel = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-medium text-gray-600">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getColor(clamped))}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        />
      </div>
    </div>
  );
}
