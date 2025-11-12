"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateRangeInputsProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * DateRangeInputs Component
 *
 * A reusable component for start and end date inputs.
 * Supports read-only mode, validation errors, and required fields.
 *
 * @example
 * ```tsx
 * <DateRangeInputs
 *   startDate={formData.startDate}
 *   endDate={formData.endDate}
 *   onStartDateChange={(value) => setFormData({ ...formData, startDate: value })}
 *   onEndDateChange={(value) => setFormData({ ...formData, endDate: value })}
 *   errors={{
 *     startDate: errors.startDate,
 *     endDate: errors.endDate,
 *   }}
 *   required
 * />
 * ```
 */
export function DateRangeInputs({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  errors,
  disabled = false,
  readOnly = false,
  required = false,
  startLabel = "Start Date",
  endLabel = "End Date",
  startId = "start-date",
  endId = "end-date",
  className,
}: DateRangeInputsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={startId}>
            {startLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={startId}
            type="datetime-local"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            disabled={disabled || readOnly}
            className={cn(
              readOnly && "bg-muted cursor-not-allowed",
              errors?.startDate && "border-destructive"
            )}
          />
          {errors?.startDate && (
            <p className="text-sm text-destructive" role="alert">
              {errors.startDate}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={endId}>
            {endLabel}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={endId}
            type="datetime-local"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={disabled || readOnly}
            className={cn(
              readOnly && "bg-muted cursor-not-allowed",
              errors?.endDate && "border-destructive"
            )}
          />
          {errors?.endDate && (
            <p className="text-sm text-destructive" role="alert">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

