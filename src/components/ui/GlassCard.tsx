"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({
  className,
  hover = false,
  children,
  ...props
}: GlassCardProps) {
  const base =
    "rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-white/40 p-6";

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(base, className)}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(base, className)} {...props}>
      {children}
    </div>
  );
}
