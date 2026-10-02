import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SwatchPicker<T extends string>({
  label,
  value,
  options,
  onChange,
  swatch,
  optionLabel,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  swatch: (option: T) => ReactNode;
  optionLabel: (option: T) => string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={cn(
                "overflow-hidden rounded-md border bg-white text-left",
                selected ? "border-slate-900 ring-2 ring-slate-900" : "border-slate-200 hover:border-slate-400"
              )}
            >
              <div className="h-14">{swatch(option)}</div>
              <div className="truncate px-1.5 py-1 text-[11px] text-slate-700">{optionLabel(option)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
