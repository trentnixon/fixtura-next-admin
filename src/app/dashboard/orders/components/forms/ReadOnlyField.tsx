"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReadOnlyFieldProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * ReadOnlyField Component
 *
 * A reusable read-only input field component with consistent styling.
 * Displays a disabled input with muted background and cursor-not-allowed.
 *
 * @example
 * ```tsx
 * <ReadOnlyField
 *   label="Account ID"
 *   value={accountId}
 *   placeholder="No value"
 * />
 * ```
 */
export function ReadOnlyField({
  label,
  value,
  placeholder = "",
  className,
  id,
}: ReadOnlyFieldProps) {
  const displayValue =
    value !== null && value !== undefined ? String(value) : "";
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        value={displayValue}
        disabled
        placeholder={placeholder}
        className="bg-muted cursor-not-allowed"
      />
    </div>
  );
}
