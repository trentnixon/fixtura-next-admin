"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva("", {
  variants: {
    variant: {
      default: "bg-green-500 hover:bg-green-600",
      warning: "bg-yellow-500 hover:bg-yellow-600",
      error: "bg-red-500 hover:bg-red-600",
      info: "bg-blue-500 hover:bg-blue-600",
      neutral: "bg-slate-500 hover:bg-slate-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: boolean;
  label?: string;
  trueLabel?: string;
  falseLabel?: string;
  className?: string;
}

/**
 * StatusBadge Component
 *
 * Standardized boolean status badge component. Automatically displays
 * appropriate label and color based on boolean status.
 *
 * @example
 * ```tsx
 * <StatusBadge status={isActive} label="Active" />
 * <StatusBadge
 *   status={isUpdating}
 *   trueLabel="Updating"
 *   falseLabel="Idle"
 *   variant="warning"
 * />
 * ```
 */
export default function StatusBadge({
  status,
  label,
  trueLabel,
  falseLabel,
  variant = status ? "default" : "error",
  className,
}: StatusBadgeProps) {
  const displayLabel = label
    ? `${label}: ${status ? trueLabel || "Yes" : falseLabel || "No"}`
    : status
    ? trueLabel || "Active"
    : falseLabel || "Inactive";

  // Override variant based on status if not explicitly set
  const badgeVariant = variant || (status ? "default" : "error");

  return (
    <Badge
      variant="outline"
      className={cn(
        statusBadgeVariants({ variant: badgeVariant }),
        "text-white border-0",
        className
      )}
    >
      {displayLabel}
    </Badge>
  );
}
