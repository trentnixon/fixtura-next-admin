"use client";

import { useMemo } from "react";
import { CalendarRange, RotateCcw } from "lucide-react";

import {
  CheckoutStatus,
  FetchOrderOverviewParams,
} from "@/types/orderOverview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface OrdersOverviewFiltersProps {
  value: FetchOrderOverviewParams;
  onChange: (value: FetchOrderOverviewParams) => void;
  onReset?: () => void;
}

type CheckoutStatusFilterValue = Exclude<CheckoutStatus, null>;

const CHECKOUT_STATUS_OPTIONS: Array<{
  value: CheckoutStatusFilterValue | "all";
  label: string;
}> = [
  { value: "all", label: "All statuses" },
  { value: "complete", label: "Complete" },
  { value: "active", label: "Active" },
  { value: "trialing", label: "Trialing" },
  { value: "past_due", label: "Past due" },
  { value: "unpaid", label: "Unpaid" },
  { value: "incomplete", label: "Incomplete" },
  { value: "incomplete_expired", label: "Incomplete expired" },
  { value: "canceled", label: "Canceled" },
];

export function OrdersOverviewFilters({
  value,
  onChange,
  onReset,
}: OrdersOverviewFiltersProps) {
  const hasActiveFilters = useMemo(() => {
    return Boolean(value.startDate || value.endDate || value.status);
  }, [value.endDate, value.startDate, value.status]);

  const handleDateChange = (
    key: "startDate" | "endDate",
    newValue?: string
  ) => {
    const trimmed = newValue?.trim() || undefined;
    onChange({
      ...value,
      [key]: trimmed,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    onChange({
      ...value,
      status:
        newStatus !== "all"
          ? (newStatus as CheckoutStatusFilterValue)
          : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {hasActiveFilters && onReset && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReset()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label
            htmlFor="orders-start-date"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <CalendarRange className="h-4 w-4" />
            Start date
          </Label>
          <Input
            id="orders-start-date"
            type="date"
            value={value.startDate ?? ""}
            onChange={(event) =>
              handleDateChange("startDate", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="orders-end-date"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <CalendarRange className="h-4 w-4" />
            End date
          </Label>
          <Input
            id="orders-end-date"
            type="date"
            value={value.endDate ?? ""}
            onChange={(event) =>
              handleDateChange("endDate", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="orders-status"
            className="text-sm font-medium text-muted-foreground"
          >
            Checkout status
          </Label>
          <Select
            value={value.status ?? "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="orders-status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {CHECKOUT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
