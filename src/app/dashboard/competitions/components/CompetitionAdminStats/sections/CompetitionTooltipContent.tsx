import type { ReactNode } from "react";
import { GanttFeature } from "@/components/ui/shadcn-io/gantt";
import { cn } from "@/lib/utils";
import { differenceInDays, differenceInWeeks, format } from "date-fns";

interface CompetitionTooltipContentProps {
  feature: GanttFeature;
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn("text-right font-medium text-slate-900", valueClassName)}
      >
        {value}
      </dd>
    </>
  );
}

export function CompetitionTooltipContent({
  feature,
}: CompetitionTooltipContentProps) {
  let durationText = "Ongoing";
  if (feature.endAt) {
    const durationDays = differenceInDays(feature.endAt, feature.startAt);
    const durationWeeks = differenceInWeeks(feature.endAt, feature.startAt);

    durationText =
      durationWeeks > 0
        ? `${durationWeeks} week${durationWeeks !== 1 ? "s" : ""}`
        : `${durationDays} day${durationDays !== 1 ? "s" : ""}`;
  }

  const sport = feature.sport as string | undefined;
  const association = feature.group as string | undefined;
  const gradeCount = feature.gradeCount as number | undefined;
  const sizeCategory = feature.sizeCategory as string | undefined;
  const cmsWeight = feature.cmsWeight as number | undefined;
  const weight = Number(feature.weight);
  const priorityBand =
    weight >= 75
      ? "High"
      : weight >= 50
        ? "Med–high"
        : weight >= 25
          ? "Medium"
          : "Lower";

  return (
    <div className="min-w-[220px] space-y-3">
      <div>
        <p className="font-semibold leading-snug text-slate-950">
          {feature.name}
        </p>
        {sport && (
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">
            {sport}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-[minmax(4.5rem,auto)_1fr] gap-x-3 gap-y-1.5 text-xs">
        <DetailRow
          label="Start"
          value={format(feature.startAt, "d MMM yyyy")}
        />
        <DetailRow
          label="End"
          value={
            feature.endAt ? format(feature.endAt, "d MMM yyyy") : "Ongoing"
          }
        />
        <DetailRow label="Duration" value={durationText} />
        <DetailRow label="Priority" value={priorityBand} />
        {association && <DetailRow label="Assoc." value={association} />}
        {feature.season && typeof feature.season === "string" && (
          <DetailRow label="Season" value={feature.season} />
        )}
        {gradeCount !== undefined && gradeCount !== null && (
          <DetailRow label="Grades" value={gradeCount} />
        )}
        {sizeCategory && (
          <DetailRow label="Size" value={sizeCategory} />
        )}
        {cmsWeight !== undefined && cmsWeight !== null && (
          <DetailRow label="CMS wt." value={`${cmsWeight}%`} />
        )}
      </dl>

      <p className="border-t border-slate-100 pt-2 text-[11px] text-muted-foreground">
        Click bar to open competition in a new tab
      </p>
    </div>
  );
}
