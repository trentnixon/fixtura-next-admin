"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ClipboardList,
  Inbox,
  Sparkles,
} from "lucide-react";
import type { InvoiceQueuePreset } from "../utils/invoiceQueueFormatters";

const PRESET_TABS: {
  value: InvoiceQueuePreset;
  label: string;
  icon: typeof Sparkles;
}[] = [
  { value: "new", label: "New", icon: Sparkles },
  { value: "outstanding", label: "Outstanding", icon: Inbox },
  { value: "closed", label: "Closed", icon: CheckCircle2 },
  { value: "all", label: "All statuses", icon: ClipboardList },
];

interface InvoiceQueuePresetTabsProps {
  value: InvoiceQueuePreset;
  onValueChange: (preset: InvoiceQueuePreset) => void;
}

/**
 * Invoice queue section tabs — navigation.pattern.section-tabs
 * (aligned with DashboardTabs /dashboard)
 */
export default function InvoiceQueuePresetTabs({
  value,
  onValueChange,
}: InvoiceQueuePresetTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as InvoiceQueuePreset)}
      className="w-full"
    >
      <div className="px-2 pb-1 pt-2">
        <TabsList
          variant="primary"
          className="flex h-auto flex-wrap justify-start gap-1"
          aria-label="Queue presets"
        >
          {PRESET_TABS.map(({ value: preset, label, icon: Icon }) => (
            <TabsTrigger key={preset} value={preset} className="gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
