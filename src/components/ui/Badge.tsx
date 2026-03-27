import * as React from "react";
import { cn } from "@/lib/utils";
import type { CourseLevel, SubscriptionPlan } from "@/lib/types";

const levelColors: Record<CourseLevel, string> = {
  Beginner: "bg-emerald-100 text-emerald-800",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-red-100 text-red-800",
};

const planColors: Record<SubscriptionPlan, string> = {
  free: "bg-gray-100 text-gray-700",
  pro: "bg-violet-100 text-violet-800",
  enterprise: "bg-blue-100 text-blue-800",
};

type BadgeProps =
  | { variant: "level"; level: CourseLevel; className?: string; children?: React.ReactNode }
  | { variant: "plan"; plan: SubscriptionPlan; className?: string; children?: React.ReactNode }
  | { variant: "achievement"; className?: string; children?: React.ReactNode };

export function Badge(props: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

  if (props.variant === "level") {
    return (
      <span className={cn(base, levelColors[props.level], props.className)}>
        {props.children ?? props.level}
      </span>
    );
  }

  if (props.variant === "plan") {
    const label = props.plan.charAt(0).toUpperCase() + props.plan.slice(1);
    return (
      <span className={cn(base, planColors[props.plan], props.className)}>
        {props.children ?? label}
      </span>
    );
  }

  // achievement
  return (
    <span
      className={cn(
        base,
        "bg-amber-50 text-amber-700 border border-amber-200",
        props.className
      )}
    >
      {props.children}
    </span>
  );
}
