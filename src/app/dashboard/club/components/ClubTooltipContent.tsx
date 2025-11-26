import { GanttFeature } from "@/components/ui/shadcn-io/gantt";
import { differenceInDays, differenceInWeeks, format } from "date-fns";

interface ClubTooltipContentProps {
  feature: GanttFeature;
}

export function ClubTooltipContent({ feature }: ClubTooltipContentProps) {
  // Calculate duration
  let durationText = "Ongoing";
  if (feature.endAt) {
    const durationDays = differenceInDays(feature.endAt, feature.startAt);
    const durationWeeks = differenceInWeeks(feature.endAt, feature.startAt);

    durationText =
      durationWeeks > 0
        ? `${durationWeeks} week${durationWeeks !== 1 ? "s" : ""}`
        : `${durationDays} day${durationDays !== 1 ? "s" : ""}`;
  }

  const competitionCount = feature.competitionCount as number | undefined;
  const validDateCount = feature.validDateCount as number | undefined;
  const teamCount = feature.teamCount as number | undefined;
  const associationCount = feature.associationCount as number | undefined;
  const associationNames = feature.associationNames as string[] | undefined;
  const sport = feature.sport as string | undefined;

  return (
    <div className="space-y-2">
      {/* Club Name */}
      <div className="font-semibold text-foreground border-b pb-2">
        {feature.name}
      </div>

      {/* Dates */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Start:</span>
          <span className="font-medium">
            {format(feature.startAt, "EEE, MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">End:</span>
          <span className="font-medium">
            {feature.endAt
              ? format(feature.endAt, "EEE, MMM d, yyyy")
              : "Ongoing"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium text-primary">{durationText}</span>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-1 border-t pt-2">
        {sport && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Sport:</span>
            <span className="capitalize">{sport}</span>
          </div>
        )}

        {competitionCount !== undefined && competitionCount !== null && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Competitions:</span>
            <span>{competitionCount}</span>
            {validDateCount !== undefined &&
              validDateCount !== null &&
              validDateCount < competitionCount && (
                <span className="text-muted-foreground">
                  ({validDateCount} with dates)
                </span>
              )}
          </div>
        )}

        {teamCount !== undefined && teamCount !== null && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Teams:</span>
            <span>{teamCount}</span>
          </div>
        )}

        {associationCount !== undefined && associationCount !== null && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Associations:</span>
            <span>{associationCount}</span>
            {associationNames &&
              associationNames.length > 0 &&
              associationNames.length <= 3 && (
                <span className="text-muted-foreground">
                  ({associationNames.join(", ")})
                </span>
              )}
            {associationNames && associationNames.length > 3 && (
              <span className="text-muted-foreground">
                ({associationNames.slice(0, 3).join(", ")}...)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
