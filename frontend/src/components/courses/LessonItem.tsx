"use client";

import { motion } from "framer-motion";
import { Play, Lock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonItemProps {
  id: number;
  title: string;
  description?: string | null;
  orderIndex: number;
  durationMinutes?: number | null;
  isFree: boolean;
  videoUrl?: string | null;
  canManage?: boolean;
  index?: number;
  onDelete?: (id: number) => void;
  onClick?: () => void;
}

export function LessonItem({
  id,
  title,
  orderIndex,
  durationMinutes,
  isFree,
  videoUrl,
  canManage = false,
  index = 0,
  onDelete,
  onClick,
}: LessonItemProps) {
  const hasAccess = isFree || !!videoUrl;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: hasAccess ? 1.01 : 1, transition: { duration: 0.15 } }}
      onClick={hasAccess ? onClick : undefined}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        hasAccess
          ? "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md cursor-pointer"
          : "bg-gray-50 border-gray-100 cursor-default"
      )}
    >
      {/* Order number */}
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
          hasAccess ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-400"
        )}
      >
        {orderIndex}
      </div>

      {/* Lesson info */}
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm", hasAccess ? "text-gray-900" : "text-gray-500")}>
          {title}
        </p>
        {durationMinutes && (
          <p className="text-xs text-gray-400 mt-0.5">{durationMinutes} min</p>
        )}
      </div>

      {/* Badges + actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isFree && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            FREE
          </span>
        )}

        {!hasAccess && !isFree && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
            LOCKED
          </span>
        )}

        {hasAccess ? (
          <Play size={16} className="text-emerald-600" />
        ) : (
          <Lock size={16} className="text-gray-300" />
        )}

        {canManage && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="text-gray-300 hover:text-red-500 transition ml-1"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
